// Models/Role.cs
using Microsoft.AspNetCore.Identity;

public class Role : IdentityRole<int>
{
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
    public List<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}