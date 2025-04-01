using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

public class ApplicationDbContext : IdentityDbContext<User, Role, int>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IHttpContextAccessor httpContextAccessor) 
        : base(options)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
    }

    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId });
        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId);
        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId);

        // Seed Permissions
        var permissions = new[]
        {
            new Permission { Id = 1, Name = "ViewUsers", Description = "View user list" },
            new Permission { Id = 2, Name = "EditUsers", Description = "Edit users" },
            new Permission { Id = 3, Name = "DeleteUsers", Description = "Delete users" },
            new Permission { Id = 4, Name = "ViewAudit", Description = "View audit logs" },
            new Permission { Id = 5, Name = "ManagePermissions", Description = "Manage role permissions" },
            new Permission { Id = 6, Name = "ViewDashboard", Description = "View dashboard" },
            new Permission { Id = 7, Name = "ViewCountries", Description = "View country explorer" },
            new Permission { Id = 8, Name = "ViewProfile", Description = "View and edit profile" }
        };
        modelBuilder.Entity<Permission>().HasData(permissions);

        // Seed Roles (AspNetRoles)
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin", NormalizedName = "ADMIN", Description = "Admin", CreatedDate = DateTime.Now, UpdatedDate = DateTime.Now, ConcurrencyStamp = Guid.NewGuid().ToString(), CreatedBy = "", UpdatedBy = "" },
            new Role { Id = 2, Name = "User", NormalizedName = "USER", Description = "User", CreatedDate = DateTime.Now, UpdatedDate = DateTime.Now, ConcurrencyStamp = Guid.NewGuid().ToString(), CreatedBy = "", UpdatedBy = "" }
        );

        // Seed RolePermissions
        modelBuilder.Entity<RolePermission>().HasData(
            permissions.Select(p => new RolePermission { RoleId = 1, PermissionId = p.Id }).ToArray() // Admin role gets all permissions
        );

        // Seed Admin User (AspNetUsers)
        var hasher = new PasswordHasher<User>();
        var adminUser = new User
        {
            Id = 1,
            UserName = "Admin",
            NormalizedUserName = "ADMIN",
            FirstName = "System",
            LastName = "Admin",
            Email = "admin@assessment.co.za",
            NormalizedEmail = "ADMIN@ASSESSMENT.CO.ZA",
            CreatedDate = DateTime.Now,
            UpdatedDate = DateTime.Now,
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            SecurityStamp = Guid.NewGuid().ToString(),
            CreatedBy = "",
            UpdatedBy = "",
            PhoneNumber = ""
        };
        adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin123!");
        modelBuilder.Entity<User>().HasData(adminUser);

        // Seed User-Role Mapping (AspNetUserRoles)
        modelBuilder.Entity<IdentityUserRole<int>>().HasData(
            new IdentityUserRole<int> { UserId = 1, RoleId = 1 } // Admin user assigned to Admin role
        );
    }

    public override int SaveChanges()
    {
        AuditChanges();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AuditChanges();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void AuditChanges()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "Anonymous";

        foreach (var entry in ChangeTracker.Entries().Where(e => e.Entity is not AuditLog && e.State != EntityState.Unchanged))
        {
            var auditLog = new AuditLog
            {
                EntityName = entry.Entity.GetType().Name,
                Action = entry.State.ToString(),
                EntityId = entry.Property("Id").CurrentValue?.ToString() ?? "New",
                Timestamp = DateTime.Now,
                UserId = userId
            };

            if (entry.State == EntityState.Modified || entry.State == EntityState.Added)
            {
                var changes = new Dictionary<string, object>();
                foreach (var prop in entry.Properties)
                {
                    if (prop.IsModified)
                        changes[prop.Metadata.Name] = prop.CurrentValue ?? "null";
                }
                auditLog.Changes = JsonSerializer.Serialize(changes);
            }

            if (entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entry.Property("IsDeleted").CurrentValue = true;
                auditLog.Action = "SoftDelete";
            }

            AuditLogs.Add(auditLog);
        }
    }
}