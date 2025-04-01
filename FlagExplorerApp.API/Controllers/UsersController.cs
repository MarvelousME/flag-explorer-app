using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

////[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public UsersController(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
    }

    [HttpGet]
    //[Authorize(Policy = "ViewUsers")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Where(u => !u.IsDeleted)
            .ToListAsync();

        // Fetch roles for each user
        var userDtos = new List<object>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(new
            {
                user.Id,
                user.UserName,
                user.FirstName,
                user.LastName,
                user.Email,
                Role = roles.FirstOrDefault() ?? "None" // Get the first role or "None"
            });
        }

        return Ok(userDtos);
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "ViewUsers")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id && !u.IsDeleted)
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound();

        var roles = await _userManager.GetRolesAsync(user);
        var userDto = new
        {
            user.Id,
            user.UserName,
            user.FirstName,
            user.LastName,
            user.Email,
            Role = roles.FirstOrDefault() ?? "None"
        };

        return Ok(userDto);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "EditUsers")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null || user.IsDeleted)
            return NotFound();

        user.FirstName = updateUserDto.FirstName;
        user.LastName = updateUserDto.LastName;
        user.Email = updateUserDto.Email;
        user.NormalizedEmail = updateUserDto.Email.ToUpper();
        user.UpdatedDate = DateTime.Now;
        user.UpdatedBy = User.Identity?.Name;

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "DeleteUsers")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null || user.IsDeleted)
            return NotFound();

        user.IsDeleted = true;
        user.UpdatedDate = DateTime.Now;
        user.UpdatedBy = User.Identity?.Name;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class UpdateUserDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}