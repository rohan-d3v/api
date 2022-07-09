module.exports = (app, axios) => {
  app.post("/utilities/col", (req, res) => {
    axios
      .get("http://api.worldbank.org/v2/country?format=json&per_page=500")
      .then((countryCodeResponse) => {
        const countryCodesArr = countryCodeResponse.data[1].map((obj) => {
          return { id: obj.id, name: obj.name.toUpperCase() };
        });
        const sourceCountry = countryCodesArr.filter((data) => {
          return data.name === req.body.source.toUpperCase();
        });

        const destinationCountry = countryCodesArr.filter((data) => {
          return data.name === req.body.destination.toUpperCase();
        });

        const sourceCountryQuery = `http://api.worldbank.org/v2/country/${sourceCountry[0].id}/indicator/PA.NUS.PRVT.PP?format=json&per_page=500`;
        const destinationCountryQuery = `http://api.worldbank.org/v2/country/${destinationCountry[0].id}/indicator/PA.NUS.PRVT.PP?format=json&per_page=500`;

        axios
          .get(sourceCountryQuery)
          .then((sourceCountryResponse) => {
            var sourceCountryData = countryDataResponseHandler(
              sourceCountryResponse.data
            );

            axios
              .get(destinationCountryQuery)
              .then((destinationCountryResponse) => {
                var destinationCountryData = countryDataResponseHandler(
                  destinationCountryResponse.data
                );

                const costOfLiving =
                  (req.body.value / sourceCountryData.value) *
                  destinationCountryData.value;

                const responseObj = {
                  "Databank Last Updated":
                    sourceCountryResponse.data[0].lastupdated,
                  Source: {
                    Country: sourceCountryData.country.value,
                    "Data Collection Year": sourceCountryData.date,
                    "PPP Value": sourceCountryData.value,
                  },
                  Destination: {
                    Country: destinationCountryData.country.value,
                    "Data Collection Year": destinationCountryData.date,
                    "PPP Value": destinationCountryData.value,
                  },
                  "Equivalent Salary Requirement": costOfLiving,
                };
                responseHandler(
                  res,
                  200,
                  "Cost of Living - What would you need to earn to have a similar life (based on your current salary) in your destination country?",
                  responseObj
                );
              })
              .catch((err) => {
                responseHandler(
                  res,
                  500,
                  "Error getting Destination Country data from the World Bank API.",
                  err
                );
              });
          })
          .catch((err) => {
            responseHandler(
              res,
              500,
              "An error occurred when trying to get the Source Country data from the World Bank API.",
              err
            );
          });
      })
      .catch((err) => {
        responseHandler(
          res,
          500,
          "An error occurred when trying to get the country codes from the World Bank API.",
          err
        );
      });
  });
};

responseHandler = (res, statusCode, message, dataObj) => {
  statusCode !== 200 && console.log(dataObj);
  res.status(statusCode).json({
    message: message,
    data: dataObj,
  });
};

countryDataResponseHandler = (countryDataResponse) => {
  var countryDataArr = countryDataResponse[1];
  var countryData = countryDataArr[0];
  for (i = 1; i < countryDataResponse[0].total && !countryData.value; i++) {
    countryData = countryDataArr[i];
  }
  return countryData;
};