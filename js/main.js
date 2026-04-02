(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 45,
        dots: false,
        loop: true,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:4
            },
            768:{
                items:6
            },
            992:{
                items:8
            }
        }
    });
    
    // Newsletter subscription functionality
    $(document).ready(function() {

        $('#newsletterForm').on('submit', function(e) {
            e.preventDefault();

            const email = $('#newsletterEmail').val().trim();
            const messageDiv = $('#newsletterMessage');

            // Clear previous messages
            messageDiv.html('');

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                messageDiv.html('<span style="color: #ff6b6b;">Please enter your email address.</span>');
                return;
            }

            if (!emailRegex.test(email)) {
                messageDiv.html('<span style="color: #ff6b6b;">Please enter a valid email address.</span>');
                return;
            }

            // Show loading state
            const submitBtn = $(this).find('button[type="submit"]');
            const originalText = submitBtn.text();
            submitBtn.prop('disabled', true).text('SUBSCRIBING...');

            // Store subscriber locally (works immediately)
            try {
                let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');

                if (subscribers.includes(email)) {
                    messageDiv.html('<span style="color: #ff6b6b;">This email is already subscribed.</span>');
                    submitBtn.prop('disabled', false).text(originalText);
                    return;
                }

                // Add new subscriber
                subscribers.push({
                    email: email,
                    date: new Date().toISOString(),
                    source: 'footer_form'
                });

                localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

                // Show success message
                messageDiv.html('<span style="color: #4CAF50;">Thank you for subscribing! We\'ll keep you updated.</span>');
                $('#newsletterEmail').val(''); // Clear the input

                // Optional: Open email client to notify admin (backup method)
                setTimeout(function() {
                    const subject = encodeURIComponent('New Newsletter Subscriber');
                    const body = encodeURIComponent(`New subscriber: ${email}\nDate: ${new Date().toLocaleString()}\n\nTotal subscribers: ${subscribers.length}`);
                    const mailtoLink = `mailto:admin@mcaddytechsolutions.com?subject=${subject}&body=${body}`;

                    // Create a temporary link and click it (opens email client)
                    const tempLink = document.createElement('a');
                    tempLink.href = mailtoLink;
                    tempLink.style.display = 'none';
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                }, 1000);

            } catch (error) {
                messageDiv.html('<span style="color: #ff6b6b;">An error occurred. Please try again.</span>');
            }
        });
    });

})(jQuery);
                
