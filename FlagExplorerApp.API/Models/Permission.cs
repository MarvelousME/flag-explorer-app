// Models/Permission.cs
public class Permission
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

// Models/RolePermission.cs
public class RolePermission
{
    public int RoleId { get; set; }
    public Role? Role { get; set; }
    public int PermissionId { get; set; }
    public Permission? Permission { get; set; }
}