document.addEventListener("DOMContentLoaded", function() {
    function loadSection(id, file) {
        fetch(file)
            .then(response => response.text())
            .then(data => document.getElementById(id).innerHTML = data);
    }

    loadSection("navbar-placeholder", "sections/navbar.html");
    loadSection("hero-placeholder", "sections/hero.html");
    loadSection("about-placeholder", "sections/about.html");
    loadSection("industrial-profile-placeholder", "sections/industrial-profile.html");
    loadSection("incentives-placeholder", "sections/incentives.html");
    loadSection("msme-placeholder", "sections/msme-schemes.html");
    loadSection("cooperative-placeholder", "sections/industrial-cooperative.html");
    loadSection("footer-placeholder", "sections/footer.html");
});
