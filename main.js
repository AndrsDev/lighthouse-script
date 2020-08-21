const Excel = require("exceljs");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

(async () => {
  const totalAudits = 1;
  const url = "https://amazon.com";
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const options = {
    output: "json",
    onlyCategories: ["performance"],
    port: chrome.port,
  };
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  worksheet.columns = [
    { header: "ID", key: "id" },
    { header: "FETCH TIME", key: "fetchTime" },
    { header: "M1", key: "m1" },
    { header: "M2.", key: "m2" },
    { header: "M3", key: "m3" },
    { header: "M4", key: "m4" },
    { header: "M5", key: "m5" },
    { header: "M6", key: "m6" },
  ];

  for (let i = 1; i <= totalAudits; i++) {
    console.log(`Starting audit ${i}/${totalAudits}`);
    const runnerResult = await lighthouse(url, options);
    const audits = runnerResult.lhr.audits;

    console.log(audits);

    worksheet.addRow({
      id: i,
      fetchTime: runnerResult.lhr.fetchTime,
      m1: audits['speed-index']['numericValue'],
      m2: audits['first-contentful-paint']['numericValue'],
      m3: audits['largest-contentful-paint']['numericValue'],
      m4: audits['interactive']['numericValue'],
      m5: audits['network-rtt']['numericValue'],
      m6: audits['network-server-latency']['numericValue'],
    });
  }

  await workbook.xlsx.writeFile("export.xlsx");
  await chrome.kill();
  console.log(`Process finished`);

})();
