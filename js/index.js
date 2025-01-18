document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        const query = searchInput.value.trim();
        
        if (!query) {
            alert("Please enter a search term.");
            return;
        }

        searchUsers(query);
    });

    async function searchUsers(query) {
        const url = `https://api.github.com/search/users?q=${query}`;
        const options = {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            displayUsers(data.items);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function displayUsers(users) {
        userList.innerHTML = ""; 
        reposList.innerHTML = ""; 

        if (users.length === 0) {
            userList.innerHTML = "<p>No users found.</p>";
            return;
        }

        users.forEach((user) => {
            const userCard = document.createElement("li");
            userCard.innerHTML = `
                <img src="${user.avatar_url}" width="50" height="50">
                <strong>${user.login}</strong>
                <a href="${user.html_url}" target="_blank">View Profile</a>
                <button class="repos-btn" data-username="${user.login}">View Repos</button>
            `;
            userList.appendChild(userCard);
        });

        document.querySelectorAll(".repos-btn").forEach((button) => {
            button.addEventListener("click", (event) => {
                const username = event.target.getAttribute("data-username");
                fetchUserRepos(username);
            });
        });
    }

    async function fetchUserRepos(username) {
        const url = `https://api.github.com/users/${username}/repos`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch repos");
            const repos = await response.json();
            displayRepos(repos);
        } catch (error) {
            console.error("Error fetching repositories:", error);
        }
    }

    function displayRepos(repos) {
        reposList.innerHTML = ""; 

        if (repos.length === 0) {
            reposList.innerHTML = "<p>No repositories found.</p>";
            return;
        }

        const repoTitle = document.createElement("h3");
        repoTitle.innerText = "Repositories:";
        reposList.appendChild(repoTitle);

        repos.forEach((repo) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            reposList.appendChild(listItem);
        });
    }
});
