// Saran - Laruche

(() => {
  const baseUrl = "https://laruchequebec.com";
  const url = baseUrl + "/explorer/projets/termines/?search=&region=&ruchePartner=0&orderBy=&category=0&sector=0&page=";
  window.scrapedData = [];
  window.scrapedPages = 0;
  document.querySelector("body").innerHTML = `<h4>Pages: <div id="pages">0</div><br /> Items: <div id="items">0</div></h4>`;


  const run = i => {
    if (i === 55) {
        alert("Done");
        return;
    }
    setTimeout(() => {
      document.querySelector("#items").innerHTML = window.scrapedData.length;
      document.querySelector("#pages").innerHTML = window.scrapedPages;
    	
      // Get per page
      $.get(url + i, html => {
        $(html).find(".project-card-content-wrap").each((i, e) => {
          const title = $(e).find(".project-card__title").text().trim();
          const projectUrl = $(e).find(".project-card__title a").attr("href");
          const region = $(e).find(".project-card__region").text().trim();
          const cardData = $(e).find(".project-card__data").map((i, $cd) => $($cd).text().trim()).toArray();
          
          // Get individual project
          $.get(baseUrl + projectUrl, pHtml => {
            const pTitle = $(pHtml).find(".project__user-name").text().trim();
            const pRegion = $(pHtml).find(".project__user-region").text().trim();
            const pContributors = $(pHtml).find(".project-tab--contributors .contributor").map((i, $pC) => ({
              name: $($pC).find("img").attr("alt"),
              town: $($pC).find(".contributor__origin").text()
            })).toArray();
            const pContributorsCount = $(pHtml).find("label[for=contributeurs] span").text().trim();
            const pPerks = $(pHtml).find(".reward").map((i, $pR) => ({
              amount: $($pR).find(".reward__amount").text().trim(),
              contributors: $($pR).find(".reward__donators").text().trim()
            })).toArray();
            const pQuestions = $(pHtml).find(".project-question").text().trim().replace(/\n[ ]+/g, '\n').replace(/\n{2,}/g, '\n\n');
            
            window.scrapedData.push({
              title,
              region,
              other: cardData,
              ownerName: pTitle,
              ownerRegion: pRegion,
              contributors: pContributors,
              contributorsCount: pContributorsCount,
              perks: pPerks,
              questions: pQuestions
            });
          });
        });
        
        window.scrapedPages++;
        run(i + 1);

      });
    }, i * 500);
  };
  run(1);
})();

