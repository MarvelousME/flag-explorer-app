using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

//[Authorize(Roles = "Admin", Policy = "ManagePermissions")]
[ApiController]
[Route("[controller]")]
public class PermissionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PermissionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPermissions()
    {
        var permissions = await _context.Permissions.ToListAsync();
        return Ok(permissions);
    }

    [HttpGet("roles/{roleId}")]
    public async Task<IActionResult> GetRolePermissions(int roleId)
    {
        var rolePermissions = await _context.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .Select(rp => rp.PermissionId)
            .ToListAsync();
        return Ok(rolePermissions);
    }

    [HttpPost("roles/{roleId}")]
    public async Task<IActionResult> UpdateRolePermissions(int roleId, [FromBody] List<int> permissionIds)
    {
        var existing = _context.RolePermissions.Where(rp => rp.RoleId == roleId);
        _context.RolePermissions.RemoveRange(existing);

        var newPermissions = permissionIds.Select(pid => new RolePermission { RoleId = roleId, PermissionId = pid });
        _context.RolePermissions.AddRange(newPermissions);
        await _context.SaveChangesAsync();
        return Ok();
    }
}