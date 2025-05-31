// Update the IJwtService interface to include the GenerateToken method
public interface IJwtService
{
    string GenerateToken(string userId, string email, string role ,string name);
    // ...other method signatures...
}
