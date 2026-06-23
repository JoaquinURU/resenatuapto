/* =========================
   FIREBASE
========================= */

import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* =========================
   APP
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const navbarToggle = document.querySelector("#navbarToggle");
    const navbarContent = document.querySelector("#navbarContent");

    if (navbarToggle && navbarContent) {
        navbarToggle.addEventListener("click", () => {
            navbarContent.classList.toggle("active");
            navbarToggle.textContent = navbarContent.classList.contains("active") ? "×" : "☰";
        });
    }

    const heroInput = document.querySelector(".hero__input");
    const heroButton = document.querySelector(".hero__search-button");
    const searchBoxInput = document.querySelector(".search-box__input");
    const searchBoxButton = document.querySelector(".search-box__button");
    const neighborhoodCards = document.querySelectorAll(".neighborhood-card");
    const filterButtons = document.querySelectorAll(".filter-button");
    const reviewForm = document.querySelector(".review-form");
    const stars = document.querySelectorAll(".star");
    const ratingInput = document.querySelector("#calificacion");
    const imageUrlInput = document.querySelector("#imagen");
    const imageFileInput = document.querySelector("#imagenArchivo");
    const imagePreview = document.querySelector("#imagePreview");
    const previewImg = document.querySelector("#previewImg");
    const searchResultsContainer = document.querySelector(".search-results");
    const homeReviewsContainer = document.querySelector(".reviews__grid");

    const barrioInput = document.querySelector("#barrio");
    const direccionInput = document.querySelector("#direccion");
    const tituloInput = document.querySelector("#titulo");
    const humedadInput = document.querySelector("#humedad");
    const ruidoInput = document.querySelector("#ruido");
    const seguridadInput = document.querySelector("#seguridad");
    const tratoInput = document.querySelector("#trato");
    const comentarioInput = document.querySelector("#comentario");

    function hasGSAP() {
        return typeof window.gsap !== "undefined";
    }

    function animatePage() {
        if (!hasGSAP()) return;

        gsap.from(".navbar", {
            y: -20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        });

        gsap.from(".hero__tag, .hero__title, .hero__text, .hero__search, .hero__actions", {
            y: 24,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            delay: 0.15
        });

        gsap.from(".hero__image", {
            scale: 0.96,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.35
        });

        gsap.from(".section-heading", {
            y: 22,
            opacity: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.15
        });

        gsap.from(".neighborhood-card", {
            y: 22,
            opacity: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.out",
            delay: 0.25
        });

        gsap.from(".about-card, .mission-item, .form-group, .search-box, .filters, .sort-controls, .cta, .about-cta", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.2
        });

        gsap.to(".instagram-float", {
            scale: 1.07,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: 2
        });
    }

    function animateReviewCards() {
        if (!hasGSAP()) return;

        gsap.from(".review-card", {
            y: 26,
            opacity: 0,
            duration: 0.55,
            stagger: 0.07,
            ease: "power2.out"
        });
    }

    function normalizeText(text) {
        return String(text)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "Fecha no disponible";
        }

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return "Fecha no disponible";
        }

        return date.toLocaleDateString("es-UY", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    function getAllReviewCards() {
        return document.querySelectorAll(".review-card");
    }

    function filterCards(searchValue) {
        const normalizedSearch = normalizeText(searchValue.trim());
        const reviewCards = getAllReviewCards();

        neighborhoodCards.forEach((card) => {
            const cardText = normalizeText(card.innerText);
            card.style.display = cardText.includes(normalizedSearch) ? "flex" : "none";
        });

        reviewCards.forEach((card) => {
            const cardText = normalizeText(card.innerText);
            card.style.display = cardText.includes(normalizedSearch) ? "block" : "none";
        });
    }

    if (heroInput) {
        heroInput.addEventListener("input", () => {
            filterCards(heroInput.value);
        });
    }

    if (heroButton && heroInput) {
        heroButton.addEventListener("click", () => {
            filterCards(heroInput.value);
        });
    }

    if (searchBoxInput) {
        searchBoxInput.addEventListener("input", () => {
            filterCards(searchBoxInput.value);
        });
    }

    if (searchBoxButton && searchBoxInput) {
        searchBoxButton.addEventListener("click", () => {
            filterCards(searchBoxInput.value);
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter = button.innerText.trim();

            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            if (selectedFilter === "Todos") {
                filterCards("");

                if (searchBoxInput) {
                    searchBoxInput.value = "";
                }

                return;
            }

            if (searchBoxInput) {
                searchBoxInput.value = selectedFilter;
            }

            filterCards(selectedFilter);
        });
    });

    neighborhoodCards.forEach((card) => {
        card.addEventListener("click", () => {
            const neighborhoodName = card.querySelector("h3").innerText;
            localStorage.setItem("selectedNeighborhood", neighborhoodName);
        });
    });

    function updateStars(selectedRating) {
        stars.forEach((star) => {
            const value = Number(star.dataset.value);

            if (value <= Number(selectedRating)) {
                star.classList.add("active");
            } else {
                star.classList.remove("active");
            }
        });
    }

    stars.forEach((star) => {
        star.addEventListener("click", () => {
            const selectedRating = star.dataset.value;

            if (ratingInput) {
                ratingInput.value = selectedRating;
            }

            updateStars(selectedRating);

            if (hasGSAP()) {
                gsap.fromTo(
                    star,
                    { scale: 1 },
                    {
                        scale: 1.3,
                        duration: 0.15,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.out"
                    }
                );
            }
        });
    });

    function showImagePreview(imageSrc) {
        if (!imagePreview || !previewImg) return;

        previewImg.src = imageSrc;
        imagePreview.classList.add("active");

        if (hasGSAP()) {
            gsap.fromTo(
                imagePreview,
                { opacity: 0, scale: 0.96 },
                { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
            );
        }
    }

    if (imageUrlInput) {
        imageUrlInput.addEventListener("input", () => {
            const imageUrl = imageUrlInput.value.trim();

            if (imageUrl) {
                showImagePreview(imageUrl);
            } else if (imagePreview) {
                imagePreview.classList.remove("active");
            }
        });
    }

    if (imageFileInput) {
        imageFileInput.addEventListener("change", () => {
            const imageFile = imageFileInput.files[0];

            if (!imageFile) return;

            const reader = new FileReader();

            reader.onload = function () {
                showImagePreview(reader.result);
            };

            reader.readAsDataURL(imageFile);
        });
    }

    function createReviewImage(review) {
        const imageUrl = review.imagen;

        if (imageUrl) {
            return `
                <img
                    src="${imageUrl}"
                    alt="Apartamento en ${review.barrio || "Montevideo"}"
                    class="review-card__image"
                >
            `;
        }

        return `
            <div class="review-card__placeholder">
                <span class="review-card__placeholder-icon">🏠</span>
                <span class="review-card__placeholder-title">${review.barrio || "Sin barrio"}</span>
                <span class="review-card__placeholder-text">Reseña sin imagen</span>
            </div>
        `;
    }

    function createReviewCard(review) {
        const publicationDate = formatDate(review.fecha);

        return `
            <article class="review-card review-card--user">

                ${createReviewImage(review)}

                <div class="review-card__content">

                    <div class="review-card__top">

                        <span class="review-card__neighborhood">
                            ${review.barrio || "Sin barrio"}
                        </span>

                        <span class="review-card__rating">
                            ⭐ ${review.calificacion || "Sin dato"}
                        </span>

                    </div>

                    <p class="review-card__date">
                        Publicado el ${publicationDate}
                    </p>

                    <h3 class="review-card__title">
                        ${review.titulo || "Sin título"}
                    </h3>

                    <p class="review-card__text">
                        ${review.comentario || "Sin comentario"}
                    </p>

                    <div class="review-card__details">

                        <span>
                            Humedad: ${review.humedad || "Sin dato"}
                        </span>

                        <span>
                            Ruido: ${review.ruido || "Sin dato"}
                        </span>

                        <span>
                            Seguridad: ${review.seguridad || "Sin dato"}
                        </span>

                        <span>
                            Trato: ${review.trato || "Sin dato"}
                        </span>

                    </div>

                    <p class="review-card__text">

                        <strong>
                            Referencia:
                        </strong>

                        ${review.direccion || "Sin referencia"}

                    </p>

                </div>

            </article>
        `;
    }

    async function loadReviews() {
        if (!searchResultsContainer && !homeReviewsContainer) return;

        try {
            const querySnapshot = await getDocs(collection(db, "reviews"));

            let reviewsHTML = "";

            querySnapshot.forEach((docItem) => {
                reviewsHTML += createReviewCard(docItem.data());
            });

            if (searchResultsContainer) {
                searchResultsContainer.innerHTML = reviewsHTML;
            }

            if (homeReviewsContainer && !searchResultsContainer) {
                homeReviewsContainer.insertAdjacentHTML("afterbegin", reviewsHTML);
            }

            animateReviewCards();

            const savedNeighborhood = localStorage.getItem("selectedNeighborhood");

            if (savedNeighborhood && searchBoxInput) {
                searchBoxInput.value = savedNeighborhood;
                filterCards(savedNeighborhood);
                localStorage.removeItem("selectedNeighborhood");
            }

        } catch (error) {
            console.error("Error cargando reseñas:", error);
        }
    }

    loadReviews();

    if (reviewForm) {
        reviewForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const imageLink = imageUrlInput ? imageUrlInput.value.trim() : "";
            const imageFile = imageFileInput ? imageFileInput.files[0] : null;

            const review = {
                barrio: barrioInput ? barrioInput.value : "",
                direccion: direccionInput ? direccionInput.value : "",
                titulo: tituloInput ? tituloInput.value : "",
                calificacion: ratingInput ? ratingInput.value : "0",
                humedad: humedadInput ? humedadInput.value : "",
                ruido: ruidoInput ? ruidoInput.value : "",
                seguridad: seguridadInput ? seguridadInput.value : "",
                trato: tratoInput ? tratoInput.value : "",
                imagen: imageLink,
                comentario: comentarioInput ? comentarioInput.value : "",
                fecha: new Date().toISOString()
            };

            if (
                !review.barrio ||
                !review.titulo ||
                review.calificacion === "0" ||
                !review.comentario
            ) {
                alert("Completá barrio, título, calificación y reseña.");
                return;
            }

            async function saveReview(finalReview) {
                try {
                    await addDoc(collection(db, "reviews"), finalReview);

                    alert("¡Reseña publicada correctamente!");

                    window.location.href = "./buscar.html";
                } catch (error) {
                    console.error("Error publicando reseña:", error);
                    alert("No se pudo publicar la reseña.");
                }
            }

            if (imageFile) {
                const reader = new FileReader();

                reader.onload = async function () {
                    review.imagen = reader.result;
                    await saveReview(review);
                };

                reader.readAsDataURL(imageFile);
            } else {
                await saveReview(review);
            }
        });
    }

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            const serviceWorkerPath = window.location.pathname.includes("/pages/")
                ? "../service-worker.js"
                : "./service-worker.js";

            navigator.serviceWorker
                .register(serviceWorkerPath)
                .then(() => {
                    console.log("PWA activada");
                })
                .catch((error) => {
                    console.error("Error PWA:", error);
                });
        });
    }

    animatePage();

    console.log("ReseñaTuApto funcionando correctamente con GSAP.");
});