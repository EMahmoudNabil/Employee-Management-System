
    using Microsoft.AspNetCore.Identity;
    using EmployeeManagementSystem.Core.Models;


    namespace EmployeeManagementSystem.Infrastructure.Data
    {
        public static class DbInitializer
        {
            public static async Task InitializeAsync(UserManager<Employee> userManager, RoleManager<IdentityRole> roleManager)
            {
                // إنشاء الأدوار
                if (!await roleManager.RoleExistsAsync("Admin"))
                    await roleManager.CreateAsync(new IdentityRole("Admin"));

                if (!await roleManager.RoleExistsAsync("Employee"))
                    await roleManager.CreateAsync(new IdentityRole("Employee"));

                // إنشاء مستخدم Admin
                if (await userManager.FindByEmailAsync("admin@example.com") == null)
                {
                    var admin = new Employee
                    {
                        UserName = "admin@example.com",
                        Email = "admin@example.com",
                        FirstName = "Admin",
                        LastName = "User",
                        NationalId = "12345678901234",
                        Age = 30,
                        PhoneNumber = "01012345678"
                    };

                    var result = await userManager.CreateAsync(admin, "Admin@123");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(admin, "Admin");
                    }
                }
            }
        }
    }

