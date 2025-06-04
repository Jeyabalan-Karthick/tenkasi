document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class smoothly
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.remove('active');
        });

        // Add active class to clicked link
        this.classList.add('active');

        // Smooth scroll to section
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
