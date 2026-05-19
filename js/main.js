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

    function normalizeText(text) {
        return text
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
        });
    });

    function showImagePreview(imageSrc) {
        if (!imagePreview || !previewImg) return;

        previewImg.src = imageSrc;
        imagePreview.classList.add("active");
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

    function createReviewCard(review) {
        const imageUrl =
            review.imagen ||
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80";

        const publicationDate = formatDate(review.fecha);

        return `
            <article class="review-card review-card--user">

                <img
                    src="${imageUrl}"
                    alt="Apartamento en ${review.barrio}"
                    class="review-card__image"
                >

                <div class="review-card__content">

                    <div class="review-card__top">

                        <span class="review-card__neighborhood">
                            ${review.barrio}
                        </span>

                        <span class="review-card__rating">
                            ⭐ ${review.calificacion}
                        </span>

                    </div>

                    <p class="review-card__date">
                        Publicado el ${publicationDate}
                    </p>

                    <h3 class="review-card__title">
                        ${review.titulo}
                    </h3>

                    <p class="review-card__text">
                        ${review.comentario}
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

    console.log("ReseñaTuApto funcionando correctamente.");
});