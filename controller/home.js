// Renders home page
export function indexPage(req, res) {
    res.render("home/index", { title: "Home Page" });
}

// Renders docs page
export function docsPage(req, res) {
    res.render("home/docs", { title: "API Documentation" });
}
