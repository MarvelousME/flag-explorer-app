public interface ICountryService
{
    Task<List<Country>> GetAllCountriesAsync();
    Task<CountryDetails> GetCountryDetailsAsync(string name);
}