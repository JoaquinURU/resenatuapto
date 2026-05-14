/* =========================
   FIREBASE
========================= */

import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* =========================
   APP
========================= */

document.addEventListener("DOMContentLoaded", () => {

    /* NAVBAR MOBILE */

    const navbarToggle = document.querySelector("#navbarToggle");
    const navbarContent = document.querySelector("#navbarContent");

    if (navbarToggle && navbarContent) {
        navbarToggle.addEventListener("click", () => {
            navbarContent.classList.toggle("active");
            navbarToggle.textContent = navbarContent.classList.contains("active") ? "×" : "☰";
        });
    }

    /* VARIABLES */

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

    const clearReviewsBtn = document.querySelector("#clearReviewsBtn");

    const barrioInput = document.querySelector("#barrio");
    const direccionInput = document.querySelector("#direccion");
    const tituloInput = document.querySelector("#titulo");
    const humedadInput = document.querySelector("#humedad");
    const ruidoInput = document.querySelector("#ruido");
    const seguridadInput = document.querySelector("#seguridad");
    const tratoInput = document.querySelector("#trato");
    const comentarioInput = document.querySelector("#comentario");

    /* HELPERS */

    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
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

    /* BUSCADOR */

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

    /* FILTROS */

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

    /* BARRIOS INDEX */

    neighborhoodCards.forEach((card) => {
        card.addEventListener("click", () => {
            const neighborhoodName = card.querySelector("h3").innerText;
            localStorage.setItem("selectedNeighborhood", neighborhoodName);
        });
    });

    /* ESTRELLAS */

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

    /* PREVIEW IMAGEN */

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

    /* CREAR CARD */

    function createReviewCard(review, reviewId) {
        const imageUrl =
            review.imagen ||
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80";

        return `
            <article class="review-card review-card--user" data-review-id="${reviewId}">
                <img 
                    src="${imageUrl}" 
                    alt="Apartamento en ${review.barrio}"
                    class="review-card__image"
                >

                <div class="review-card__content">
                    <div class="review-card__top">
                        <span class="review-card__neighborhood">${review.barrio}</span>
                        <span class="review-card__rating">⭐ ${review.calificacion}</span>
                    </div>

                    <h3 class="review-card__title">${review.titulo}</h3>

                    <p class="review-card__text">${review.comentario}</p>

                    <div class="review-card__details">
                        <span>Humedad: ${review.humedad || "Sin dato"}</span>
                        <span>Ruido: ${review.ruido || "Sin dato"}</span>
                        <span>Seguridad: ${review.seguridad || "Sin dato"}</span>
                        <span>Trato: ${review.trato || "Sin dato"}</span>
                    </div>

                    <p class="review-card__text">
                        <strong>Referencia:</strong> ${review.direccion || "Sin referencia"}
                    </p>

                    <div class="review-card__actions">
                        <button 
                            class="review-action-btn delete-review-btn"
                            data-id="${reviewId}"
                        >
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    /* CARGAR RESEÑAS */

    async function loadReviews() {
        if (!searchResultsContainer && !homeReviewsContainer) return;

        try {
            const querySnapshot = await getDocs(collection(db, "reviews"));

            let reviewsHTML = "";

            querySnapshot.forEach((docItem) => {
                reviewsHTML += createReviewCard(docItem.data(), docItem.id);
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

    /* PUBLICAR RESEÑA */

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
                alert("Completá barrio, título, calificación y reseña para poder publicar.");
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

    /* ELIMINAR RESEÑA */

    document.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-review-btn")) {
            const reviewId = event.target.dataset.id;

            const confirmDelete = confirm("¿Seguro que querés eliminar esta reseña?");

            if (!confirmDelete) return;

            try {
                await deleteDoc(doc(db, "reviews", reviewId));
                event.target.closest(".review-card").remove();
                alert("Reseña eliminada correctamente.");
            } catch (error) {
                console.error("Error eliminando reseña:", error);
                alert("No se pudo eliminar la reseña.");
            }
        }
    });

    /* BORRAR TODAS */

    if (clearReviewsBtn) {
        clearReviewsBtn.addEventListener("click", async () => {
            const confirmDelete = confirm("¿Seguro que querés borrar todas las reseñas?");

            if (!confirmDelete) return;

            try {
                const querySnapshot = await getDocs(collection(db, "reviews"));

                const deletePromises = [];

                querySnapshot.forEach((reviewDoc) => {
                    deletePromises.push(deleteDoc(doc(db, "reviews", reviewDoc.id)));
                });

                await Promise.all(deletePromises);

                alert("Reseñas eliminadas correctamente.");
                window.location.reload();

            } catch (error) {
                console.error("Error borrando reseñas:", error);
                alert("No se pudieron borrar las reseñas.");
            }
        });
    }

    /* PWA */

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            const serviceWorkerPath = window.location.pathname.includes("/pages/")
                ? "../service-worker.js"
                : "./service-worker.js";

            navigator.serviceWorker.register(serviceWorkerPath)
                .then(() => {
                    console.log("PWA activada");
                })
                .catch((error) => {
                    console.error("Error PWA:", error);
                });
        });
    }

    console.log("ReseñaTuApto funcionando estable.");
});