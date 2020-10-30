// fetch("http://tarif.customs.uz/calc/view_calc.jsp", {
//   "headers": {
//     "accept": "text/html, */*; q=0.01",
//     "accept-language": "uz,ru;q=0.9,en-US;q=0.8,en;q=0.7",
//     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//     "save-data": "on",
//     "x-requested-with": "XMLHttpRequest",
//     "cookie": "JSESSIONID=23EEE1C50B9A5598442CFE8E9A7D5872"
//   },
//   "referrer": "http://tarif.customs.uz/index.jsp",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": "tnved=8701100000&rejim=01&sending_country=156++&lang=uz_UZ&orign_country=860&trade_country=392",
//   "method": "POST",
//   "mode": "cors"
// });


// app.get("/rates", async (req, res) => {
//   try {

//     const URL = "http://tarif.customs.uz/index.jsp";
  
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto(URL, { waitUntil: "networkidle2" });
  
//     await page.type("#tnved_code", `${req.query.tnved}`);
//     await page.select("#sending_country", `${req.query.sending_country}`);
//     await page.select("#orign_country", `${req.query.orign_country}`);
//     await page.select("#trade_country", `${req.query.trade_country}`);
//     //await page.click("#rejim2");
//     await page.waitForSelector('#sbor');
//     await page.waitForSelector('#poshlina');
//     await page.waitForSelector('#aksiz');
//     await page.waitForSelector('#nds');
  
//     let data = await page.evaluate(() => {
//       let sbor = document.getElementById("sbor").innerText;
//       let poshlina = document.getElementById("poshlina").innerText;
//       let aksiz = document.getElementById("aksiz").innerText;
//       let nds = document.getElementById("nds").innerText;
  
//       return [
//         {rate: 10, info: sbor},
//         {rate: 20, info: poshlina},
//         {rate: 27, info: aksiz},
//         {rate: 29, info: nds},
//       ];
//     });
  
//     console.log(data);
  
//     await browser.close();
  
//     res.send(data);

//   } catch (err) {
//     console.log(err.message);
//   }
// })