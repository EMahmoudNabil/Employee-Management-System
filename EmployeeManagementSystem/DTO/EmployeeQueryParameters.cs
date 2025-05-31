namespace EmployeeManagementSystem.DTO
{
    public class EmployeeQueryParameters
    {
        public string? Search { get; set; }
        public string? SortBy { get; set; } = "FirstName";
        public bool IsDescending { get; set; } = false;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
