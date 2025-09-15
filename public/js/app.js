// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", async () => {
    const USERS_PER_PAGE = 10;
    let currentPage = 1;
    /** CODAR */

    const usersDiv = document.getElementById("users");
    const paginationUl = document.getElementById("pagination");

    async function fetchUsers(page = 1) {
        const offset = (page - 1) * USERS_PER_PAGE;
        const url = `/api/users?limit=${USERS_PER_PAGE}&offset=${offset}`;
        const response = await fetch(url);
        if (!response.ok) {
            usersDiv.innerHTML = `<div class="alert alert-danger">Erro ao carregar usuários.</div>`;
            paginationUl.innerHTML = "";
            return { rows: [], count: 0 };
        }
        return await response.json();
    }

    function renderUsers(users) {
        usersDiv.innerHTML = "";
        if (users.length === 0) {
            usersDiv.innerHTML = `<div class="alert alert-warning">Nenhum usuário encontrado.</div>`;
            return;
        }
        users.forEach(user => {
            const div = document.createElement("div");
            div.className = "card mb-2";
            div.innerHTML = `
                <div class="card-body d-flex align-items-center gap-3">
                    <img src="${user.photo ? '/storage/images/' + user.photo : './img/squirtle.png'}" alt="Foto" style="width:40px;height:40px;object-fit:cover;border-radius:50%;">
                    <div>
                        <strong>${user.name || '—'}</strong><br>
                        <small>${user.email || '—'}</small>
                    </div>
                </div>
            `;
            usersDiv.appendChild(div);
        });
    }

    function renderPagination(total, page) {
        paginationUl.innerHTML = "";
        const totalPages = Math.ceil(total / USERS_PER_PAGE);
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = "page-item" + (i === page ? " active" : "");
            const a = document.createElement("a");
            a.className = "page-link";
            a.href = "#";
            a.textContent = i;
            a.addEventListener("click", (e) => {
                e.preventDefault();
                if (currentPage !== i) {
                    currentPage = i;
                    update();
                }
            });
            li.appendChild(a);
            paginationUl.appendChild(li);
        }
    }

    async function update() {
        const { rows, count } = await fetchUsers(currentPage);
        renderUsers(rows);
        renderPagination(count, currentPage);
    }

    update();
});
