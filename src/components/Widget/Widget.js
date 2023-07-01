import React, { useEffect } from "react";

// Add the widget on the page
const Widget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    const div = document.createElement("div");

    div.id = "widget-holder";

    script.src = "https://widgets.kiwi.com/scripts/widget-search-iframe.js";
    script.setAttribute("data-currency", "EUR");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-affilid", "alexandruszokemaneawidget");
    script.setAttribute("data-from", "cluj-napoca_ro");
    script.setAttribute("data-results-only", "true");

    document.getElementById("widget-root").appendChild(div);
    document.getElementById("widget-root").appendChild(script);
  }, []);

  return <div id="widget-root" />;
};

export default Widget;
