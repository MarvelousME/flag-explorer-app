public class CountryService : ICountryService
{
    private readonly HttpClient _httpClient;

    public CountryService(HttpClient httpClient)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _httpClient.BaseAddress = new Uri("https://restcountries.com/v3.1/");
    }

    public async Task<List<Country>> GetAllCountriesAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<List<RestCountry>>("all");
        return response?.Select(c => new Country
        {
            Name = c.Name.Common,
            Flag = c.Flags.Png
        }).ToList() ?? new List<Country>();
    }

    public async Task<CountryDetails> GetCountryDetailsAsync(string name)
    {
        var response = await _httpClient.GetFromJsonAsync<List<RestCountry>>($"name/{name}");
        var country = response?.FirstOrDefault();
        if (country == null) throw new Exception("Country not found");

        return new CountryDetails
        {
            Name = country.Name.Common,
            Population = country.Population,
            Capital = country.Capital?.FirstOrDefault() ?? "N/A",
            Flag = country.Flags.Png
        };
    }
}

public class RestCountry
{
    public Name Name { get; set; } = new Name();
    public Flags Flags { get; set; } = new Flags();
    public int Population { get; set; }
    public List<string> Capital { get; set; } = new List<string>();
}

public class Name
{
    public string Common { get; set; } = string.Empty;
}

public class Flags
{
    public string Png { get; set; } = string.Empty;
}