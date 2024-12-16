
//recupération des travaux

const gallery = document.querySelector(".gallery")

async function getWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();
    return works;
}

// Project

async function displayWorks(category) {
    gallery.innerHTML = ""
    const works = await getWorks()
    //const filteredWorks = si catégorie ? on filtre nos travaux par rapport a la category passé en paramètre de fonction : on renvoie tout les travaux car pas de catégorie
    const filteredWorks = category ? works.filter(work => work.category.id === category.id) : works
    for (let index = 0; index < filteredWorks.length; index++) {
        const work = filteredWorks[index];
        const figureElement = document.createElement("figure")
        const figureImgElement = document.createElement("img")
        figureImgElement.src = work.imageUrl
        figureImgElement.alt = work.title
        const figureCaptionElement = document.createElement("figcaption")
        figureCaptionElement.textContent = work.title
        figureElement.appendChild(figureImgElement)
        figureElement.appendChild(figureCaptionElement)
        gallery.appendChild(figureElement)
    }
}


//***Creation des boutton***//

async function getCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories")
    return await reponse.json();
}

function createCategoryButton(category) {
    const btn = document.createElement("button")
    btn.textContent = category ? category.name : "Tous";
    btn.className = `button__category ${!category ? "active" : ""}`;
    btn.addEventListener("click", (event) => {
        event.preventDefault();
        handleFilterCategory(category)
        btn.classList.add("active")
    })
    return btn;
}

async function displayCategoriesButton() {
    const categories = await getCategories();
    const portfolioCategories = document.querySelector(".portfolio__categories")

    const btnAll = createCategoryButton()
    if (portfolioCategories) portfolioCategories.appendChild(btnAll)

    for (let index = 0; index < categories.length; index++) {
        const category = categories[index];
        const btn = createCategoryButton(category)
        if (portfolioCategories) portfolioCategories.appendChild(btn)
    }
}

//filtrer au click sur le bouton par catégorie et enleve la class active sur les boutton précedent//

async function handleFilterCategory(category) {
    const active = document.querySelector(".button__category.active")
    active.classList.remove("active")


    const categories = await getCategories();
    const selectedCategory = categories.find(item => item.id === (category && category.id))
    displayWorks(selectedCategory)
}



//Mode edition//

function displayEditorMode() {
    if (sessionStorage.authToken) {
        const headerEditorMod = document.querySelector("header")
        headerEditorMod.style.marginTop = "70px";
        const editorMod = document.querySelector(".mode__edition.hidden")
        editorMod.classList.remove("hidden")
        const portfolioEdit = document.querySelector(".portfolio__edit")
        portfolioEdit.classList.add("portfolio__edit--flex")
        const portfolioCategory = document.querySelector(".portfolio__categories")
        portfolioCategory.remove()

    } else {
        const modifiedButton = document.querySelector('.button__modifed')
        modifiedButton.classList.add("hidden")
        const portfolioProject = document.querySelector('.flex-center')
        portfolioProject.classList.remove('flex-center')
    }
}

displayEditorMode()

// fonction qui gère la deconnexion 

window.onload = function () {
    if (sessionStorage.authToken) {
        const navLoginLink = document.getElementById("login__link")
        navLoginLink.textContent = "logout";
        navLoginLink.addEventListener("click", (event) => {
            event.preventDefault()
            sessionStorage.removeItem("authToken")
            window.location.replace("./index.html");
            navLoginLink.textContent = "login";
        })
    }
}



//Modal//

let modal = null

//**ouveture de la modale et création des works avec les différents élement qui les composent**//

if (sessionStorage.authToken) {
    const openModal = async function (e) {
        e.preventDefault()

        const modal = document.querySelector(".modal")
        modal.classList.add('active');

        const modalPhotos = document.querySelector('.modal__photos');
        const works = await getWorks();
        modalPhotos.innerHTML = ""

        works.forEach(work => {
            const workContain = document.createElement("div")
            const img = document.createElement('img');
            const button = document.createElement('button')
            const buttonIcon = document.createElement('i')
            button.className = "button__trash"
            workContain.className = "js-modal-photo-work"
            buttonIcon.classList.add('fa-solid', 'fa-trash-can')
            button.classList.add('jsclose')
            img.src = work.imageUrl;
            img.alt = work.title;
            button.id = work.id;
            img.className = "modal__photos--img"
            workContain.appendChild(img)
            button.appendChild(buttonIcon)
            workContain.appendChild(button)
            modalPhotos.appendChild(workContain)

        });


        modalAdd.style.display = "none"
        modalFirst.style.display = "block"


        const allBtnTrash = document.querySelectorAll(".button__trash");
        allBtnTrash.forEach(button => {
            button.addEventListener("click", () => {
                deleteWork(button.id);
            });
        });

    }


    if (sessionStorage.authToken) {
    }

    const closeModal = function (e) {
        e.preventDefault()
        const modal = document.querySelector(".modal")
        modal.classList.remove('active');

        inputSelect = document.querySelector('.modalTwo select')
        inputSelect.value = "";

        const title = document.querySelector(".modalTwo #title")
        title.value = "";

        filePicture.style.display = "none";
        fileLabel.style.display = "block";
        fileIcon.style.display = "block";
        fileP.style.display = "block";
    };



    const stopPropagation = function (e) {
        e.stopPropagation()
    }


    const buttonModified = document.querySelector(".button__modifed").addEventListener("click", openModal)

    const buttonClose = document.getElementById("modal__close").addEventListener("click", closeModal)

    const modalAddCross = document.querySelector('.modalTwo .fa-xmark').addEventListener("click", closeModal)

}


displayWorks();
displayCategoriesButton();




//fonction pour suprimmez un traville lors du click sur une poubelle

async function deleteWork(id) {
    const deleteApi = "http://localhost:5678/api/works/";
    const token = sessionStorage.authToken;

    let response = await fetch(deleteApi + id, {
        method: "DELETE",
        headers: {
            authorization: "Bearer " + token,
        }
    });


    if (response.ok) {
        console.log("delete reussi");


        const workElement = document.getElementById(id);
        if (workElement) {
            workElement.parentElement.remove();
        }
    } else {
        if (response.status == 401) {
            console.error("error 401");
        } else if (response.status == 500) {
            console.error("error 500");
        }
    }
}


//Boutton pour la deuxième modal//

const buttonAdd = document.querySelector('.modalTwo__button')
const modalAdd = document.querySelector('.modalTwo')
const modalFirst = document.querySelector('.modal__content')
const arrowLeft = document.querySelector('.fa-arrow-left')

function displayAddModal() {
    buttonAdd.addEventListener("click", () => {
        modalAdd.style.display = "flex"
        modalFirst.style.display = "none"
    })

    arrowLeft.addEventListener("click", () => {
        modalAdd.style.display = "none"
        modalFirst.style.display = "block"
    })

}
displayAddModal()



//**prévisualisation de l'image**//

const filePicture = document.querySelector('.container__file img')
const fileInput = document.querySelector('.container__file input')
const fileLabel = document.querySelector('.container__file label')
const fileIcon = document.querySelector('.container__file .fa-image')
const fileP = document.querySelector('.container__file p')

//*Ecouter les changement sur l'input file*/

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            filePicture.src = e.target.result
            filePicture.style.display = "flex"
            fileLabel.style.display = "none"
            fileIcon.style.display = "none"
            fileP.style.display = "none"
        }
        reader.readAsDataURL(file)
    }
})



//***création de façon dynamique des categories dans l'input select***//

let inputSelect;

async function modalInputCategorys() {
    const categories = await getCategories()
    inputSelect = document.querySelector('.modalTwo select')
    categories.forEach(categorie => {
        const option = document.createElement('option')
        option.value = categorie.id
        option.textContent = categorie.name
        inputSelect.appendChild(option)
        inputSelect.value = "";
    });
}

modalInputCategorys()




const form = document.querySelector(".modalTwo form");

// Écouter les changements sur les champs du formulaire

form.addEventListener('change', () => {
    // Récupération du bouton et des champs du formulaire
    const buttonModalTwo = document.querySelector("#ModalTwo__button");
    const title = document.querySelector(".modalTwo #title").value;
    const categoryId = document.querySelector(".modalTwo #category").value;
    const fileInput = document.querySelector(".modalTwo input[type='file']");
    const file = fileInput.files[0]; // Vérifie si un fichier est sélectionné
    console.log(title, categoryId, file);

    // Vérifie si un des champs est vide
    if (!title || !categoryId || !file) {
        buttonModalTwo.style.backgroundColor = "gray";
        buttonModalTwo.disabled = true; // Désactiver le bouton
    } else {
        buttonModalTwo.style.backgroundColor = "green";
        buttonModalTwo.disabled = false; // Activer le bouton
    }
});


//Ajouter un Projet partie a reviser


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.querySelector(".modalTwo #title").value;
    const categoryId = document.querySelector(".modalTwo #category").value;
    const fileInput = document.querySelector(".modalTwo input[type='file']");
    const file = fileInput.files[0]; // Assure que nous obtenons le fichier sélectionné

    if (!title || !categoryId || !file) {
        alert("Merci de remplir tous les champs");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categoryId);

    const token = sessionStorage.getItem("authToken");

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, // Assure un espace après "Bearer"
            },
            body: formData,
        });

        if (!response.ok) {
            // Gestion des erreurs si le statut de réponse n'est pas "ok"
            const error = await response.json(); // Récupère le message d'erreur du serveur
            alert("Erreur lors de l'ajout du projet : " + (error.message || response.statusText));
        } else {
            const result = await response.json();
            alert("Projet ajouté avec succès !");
            form.reset(); // Réinitialise le formulaire après un ajout réussi
        }
    } catch (error) {
        console.error("Erreur de requête :", error);
    }
});






























