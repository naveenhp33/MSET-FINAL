function updateCountdown() {
    const eventDate = new Date("April 25, 2025 00:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = eventDate - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
    } else {
        document.getElementById("countdown").innerHTML = "<p>The event has started!</p>";
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

function showDetails(imageSrc, name, designation) {
    document.getElementById('fullImage').src = imageSrc;
    document.getElementById('name').textContent = name;
    document.getElementById('designation').textContent = designation;
}

// Function to close the popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function downloadBrochure() {
    const link = document.createElement('a');
    link.href = '\\assests\\ICMSET 25 .pdf'; // Change this to your actual brochure file path
    link.download = 'brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

        
