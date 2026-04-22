const axios = require('axios');

async function accuweather(city) {
    try {
        if (!city) throw new Error('City is required.');
        
        const ACCUWEATHER_API_KEY = 'd7e795ae6a0d44aaa8abb1a0a7ac19e4';
        const fahrenheitToCelsius = f => ((f - 32) * 5 / 9).toFixed(1);
        
        const { data: locationData } = await axios.get('https://api.accuweather.com/locations/v1/cities/search.json', {
            params: {
                q: city,
                apikey: ACCUWEATHER_API_KEY,
                language: 'en-US'
            }
        });
        
        const location = locationData[0];
        if (!location) throw new Error('No location found.');
        
        const { data: forecastData } = await axios.get(`https://api.accuweather.com/forecasts/v1/daily/10day/${location.Key}`, {
            params: {
                apikey: ACCUWEATHER_API_KEY,
                details: true,
                language: 'en-US'
            }
        });
        
        return {
            location: {
                name: location.LocalizedName,
                country: location.Country.LocalizedName
            },
            forecastData: {
                Text: forecastData.Headline.Text,
                Date: (new Date(forecastData.Headline.EffectiveDate).toLocaleDateString('en-US')),
                DailyForecasts: forecastData.DailyForecasts.map(day => ({
                    Date: (new Date(day.Date).toLocaleDateString('en-US')),
                    Temperature: {
                        Min: fahrenheitToCelsius(day.Temperature.Minimum.Value),
                        Max: fahrenheitToCelsius(day.Temperature.Maximum.Value)
                    },
                    Day: {
                        IconPhrase: day.Day.IconPhrase,
                        HasPrecipitation: day.Day.HasPrecipitation,
                        PrecipitationType: day.Day.PrecipitationType || null,
                        PrecipitationProbability: day.Day.PrecipitationProbability,
                        ThunderstormProbability: day.Day.ThunderstormProbability,
                        Wind: {
                            Speed: day.Day.Wind.Speed.Value,
                            Direction: day.Day.Wind.Direction.English
                        },
                        CloudCover: day.Day.CloudCover
                    },
                    Night: {
                        IconPhrase: day.Night.IconPhrase,
                        HasPrecipitation: day.Night.HasPrecipitation,
                        PrecipitationType: day.Night.PrecipitationType || null,
                        PrecipitationProbability: day.Night.PrecipitationProbability,
                        ThunderstormProbability: day.Night.ThunderstormProbability,
                        Wind: {
                            Speed: day.Night.Wind.Speed.Value,
                            Direction: day.Night.Wind.Direction.English
                        },
                        CloudCover: day.Night.CloudCover
                    },
                    HoursOfSun: day.HoursOfSun,
                    AirAndPollen: day.AirAndPollen.reduce((acc, item) => ({
                        ...acc,
                        [item.Name]: item.Category
                    }), {}),
                    MobileLink: day.MobileLink
                }))
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = accuweather;
