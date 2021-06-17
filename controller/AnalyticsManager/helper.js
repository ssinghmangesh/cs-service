const CsvParser = require("json2csv").Parser;

const download = (data) => {
    const csvFields = Object.keys(data[0]);
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(data);
    return csvData;
}

module.exports = {
    download
}