// Hero
const heroGreeting = document.querySelector(".section__hero--greeting");
const heroDate = document.querySelector(".hero--date");
const heroTime = document.querySelector(".hero--time");
const heroWeatherIcon = document.querySelector(".hero__weather--icon");
const heroWeatherMain = document.querySelector(".hero__weather--main");

const heroWeatherDescription = document.querySelector(
    ".hero__weather--description"
);
const heroWeatherTemperature = document.querySelector(".hero__weather--temp");

// To Do List
const listForm = document.querySelector(".section__list--form");
const listInput = document.querySelector("#input");
const listType = document.querySelector("#type");
const listDifficulty = document.querySelector("#difficulty");
const listButton = document.querySelector(".btn--input");

const listContainer = document.querySelector(".section__list--container");

// Shop
const money = document.querySelector("#shop--money");
const shopContainer = document.querySelector(".section__shop--container");

// Shop function
class ShopItem {
    constructor({ item, time, points, title, description }) {
        this.item = item;
        this.time = time;
        this.points = points;
        this.title = title;
        this.description = description;
    }
}

class ListItem {
    constructor(id, title, type, difficulty, points, completed) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.difficulty = difficulty;
        this.points = points;
        this.completed = completed;
    }
}

class ListItemRepeat extends ListItem {
    constructor(id, title, type, difficulty, points, completions) {
        super(id, title, type, difficulty, points);
        this.completions = completions;
    }
}

const items = [
    {
        id: 1,
        item: "short-break",
        time: 5,
        points: 10,
        title: "5-minute refresh",
        description:
            "Quick stretch, water break (perfect for a quick energy boost)",
    },
    {
        id: 2,
        item: "short-break",
        time: 10,
        points: 20,
        title: "10-minute break",
        description:
            "Social media check, light snack (good for a mid-session pick-me-up)",
    },
    {
        id: 3,
        item: "short-break",
        time: 15,
        points: 40,
        title: "15-minute power down",
        description:
            "Short meditation, light exercise (ideal for a deeper refresh)",
    },
    {
        id: 4,
        item: "social-media",
        time: 10,
        points: 50,
        title: "Quick Scroll",
        description: "10 minutes (low cost for a brief scroll)",
    },
    {
        id: 5,
        item: "social-media",
        time: 20,
        points: 80,
        title: "Deep dive",
        description: "20 minutes (moderate cost for engaging with content)",
    },
    {
        id: 6,
        item: "social-media",
        time: 30,
        points: 100,
        title: "ADHD Granter",
        description:
            "30 minutes (highest cost for a full social media session)",
    },
    {
        id: 7,
        item: "gaming",
        time: 15,
        points: 40,
        title: "Casual play",
        description: "15 minutes (low cost for a quick gaming fix)",
    },
    {
        id: 8,
        item: "gaming",
        time: 30,
        points: 60,
        title: "Lil-bit of gaming",
        description:
            "30 minutes (moderate cost for a deeper gameplay experience)",
    },
    {
        id: 9,
        item: "gaming",
        time: 45,
        points: 80,
        title: "No-Lifer",
        description: "45 minutes (highest cost for a longer gaming period)",
    },
];

// App
class App {
    #points = 0;
    #list = [];
    difficultyChart = {
        Easy: 10,
        Medium: 20,
        Hard: 30,
        EasyRepeat: 5,
        MediumRepeat: 10,
        HardRepeat: 15,
    };
    constructor() {
        // Shop
        this._renderShopItems(items);

        // Hero
        this._renderDate();

        // Weather
        this._getGeolocation();

        // Render List
        this._getLocalStorage();
        this._renderMoney();
        this._renderToDoList();
        listButton.addEventListener("click", this._addList.bind(this));
    }

    _addList(e) {
        e.preventDefault();
        const [input, difficulty, type] = [
            listInput.value,
            listDifficulty.value,
            listType.value,
        ];
        console.log([input, difficulty, type]);
        if (!input) {
            alert("Please enter a valid task");
            return;
        }
        if (type === "once") {
            this.#list.push(
                new ListItem(
                    Date.now(),
                    input,
                    type,
                    difficulty,
                    this.difficultyChart[difficulty]
                )
            );
        } else {
            this.#list.push(
                new ListItemRepeat(
                    Date.now(),
                    input,
                    type,
                    difficulty,
                    this.difficultyChart[difficulty + "Repeat"],
                    0
                )
            );
        }
        this._renderToDoList();
    }
    _getLocalStorage() {
        const localStorageList = JSON.parse(localStorage.getItem("list"));
        let localStorageMoney = JSON.parse(localStorage.getItem("money")) || 0;
        const lastSavedDateStr =
            JSON.parse(localStorage.getItem("lastSavedDate")) || null;
        const lastSavedDate = lastSavedDateStr
            ? new Date(lastSavedDateStr)
            : null;

        const currentDate = new Date();
        if (
            lastSavedDate &&
            currentDate.getDate() !== lastSavedDate.getDate()
        ) {
            localStorageList.forEach((list) => {
                if (list.type === "repeat") {
                    list.completions = 0;
                } else {
                    list.completed = false;
                }
            });
            localStorageMoney = 0;
        }
        localStorageList.forEach((data) => {
            if (data.type === "once") {
                this.#list.push(
                    new ListItem(
                        data.id,
                        data.title,
                        data.type,
                        data.difficulty,
                        data.points,
                        data.completed
                    )
                );
            } else {
                this.#list.push(
                    new ListItemRepeat(
                        data.id,
                        data.title,
                        data.type,
                        data.difficulty,
                        data.points,
                        data.completions
                    )
                );
            }
        });
        this.#points = localStorageMoney;
        console.log(this.#list);
        localStorage.setItem("lastSavedDate", JSON.stringify(currentDate));
    }

    _setLocalStorage() {
        localStorage.setItem("list", JSON.stringify(this.#list));
        localStorage.setItem("money", JSON.stringify(this.#points));
    }

    _renderToDoList() {
        listContainer.innerHTML = "";
        if (!this.#list.length) return;
        console.log(this.#list);
        this.#list.forEach((list) => {
            console.log(list);
            const html = `
            <li class="list list--${
                list.type
            } list__${list.difficulty.toLowerCase()} ${
                list.completed ? "completed" : ""
            }" data-id=${list.id}>
                <h3 class="list--task">${list.title}</h3>

                ${
                    list.type === "once"
                        ? `
                    <div>
                        <p class="list--points">${list.difficulty} [${list.points}$]</p>
                        <button class="list__button list__button--once" data-id=${list.id}>
                            Complete!
                        </button>
                    </div>`
                        : `
                    <div>
                        <p class="list--points">${list.difficulty} [${list.points}$ / completion]</p>
                        <button class="list__button list__button--repeat" data-id=${list.id}>
                            Add completion!
                        </button>
                        <p>Total completions = <span>${list.completions}</span></p>
                    </div>`
                }
                <button class="list--delete" data-id=${list.id}>Delete</button>
            </li>
        `;
            listContainer.insertAdjacentHTML("beforeend", html);

            let id = list.id;
            const deleteButton = listContainer.querySelector(
                `.list--delete[data-id="${id}"]`
            );

            const onceButton = listContainer.querySelector(
                `.list__button--once[data-id="${id}"]`
            );

            const repeatButton = listContainer.querySelector(
                `.list__button--repeat[data-id="${id}"]`
            );
            const button = onceButton ?? repeatButton;
            console.log(onceButton, repeatButton);
            button.addEventListener("click", this._completeTask.bind(this));
            deleteButton.addEventListener(
                "dblclick",
                this._deleteList.bind(this, id)
            );
        });
    }
    _completeTask(e) {
        const id = e.target.dataset.id;
        const index = this.#list.findIndex((list) => list.id === parseInt(id));
        const list = this.#list[index];
        if (list.type === "once") {
            this.#points += list.points;
            list.completed = true;
        } else {
            this.#points += list.points;
            this.#list[index].completions += 1;
        }
        document
            .querySelector(`.list[data-id="${id}"]`)
            .classList.add("completed");
        this._setLocalStorage();
        this._renderToDoList();
        this._renderMoney();
    }
    _deleteList(id, event) {
        const index = this.#list.findIndex((list) => list.id === id);
        this.#list.splice(index, 1);
        this._setLocalStorage();
        this._renderToDoList();
    }

    // Hero function
    _renderDate() {
        setInterval(() => {
            const now = new Date();
            const locale = navigator.language;

            const timeOptions = {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            };
            const timeFormat = new Intl.DateTimeFormat(
                locale,
                timeOptions
            ).format(now);
            heroTime.textContent = timeFormat;

            const dateOptions = {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            };
            const dateFormat = new Intl.DateTimeFormat(
                locale,
                dateOptions
            ).format(now);

            heroDate.textContent = dateFormat;
            let currentHour = now.getHours();

            let greeting;
            if (currentHour < 12) {
                greeting = `Rise and shine, User! Today's a new day to crush your goals!`;
            } else if (currentHour < 17) {
                greeting = `Hey User, hope you're having a productive day! You got this!`;
            } else {
                greeting = `Hey User, winding down for the day? Take a moment to reflect on your accomplishments!`;
            }

            heroGreeting.textContent = greeting;
        }, 1000);
    }
    _getGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this._fetchLocation.bind(this)
            );
        }
    }
    _fetchLocation(position) {
        const { latitude: lat, longitude: lng } = position.coords;
        this._fetchWeather(lat, lng);
    }
    async _fetchWeather(lat, lng) {
        // API 26ed561a0a57b6af79fe46b318dcda78
        let weather;
        let temps;
        await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=26ed561a0a57b6af79fe46b318dcda78`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                weather = data.weather[0];
                temps = data.main;
            });
        const { main, description, icon } = weather;
        const { temp } = temps;

        this._renderWeather(main, description, icon, temp);
    }
    _renderWeather(main, description, icon, temp) {
        heroWeatherMain.textContent = main;
        heroWeatherDescription.textContent = description;
        heroWeatherTemperature.textContent = `${temp}°C`;
        heroWeatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }
    // Shop function
    _renderMoney() {
        money.textContent = `${this.#points}$`;
    }

    _renderShopItems(items) {
        items.forEach((data) => {
            const html = `
                <li class="item" data-id=${data.id}>
                    <h3>${data.title}</h3>
                    <div>
                        <p class="section__list--points">${data.points}$</p>
                        <p class="description">${data.description}</p>
                        <button class="shop--button" data-id=${data.id}>Turn in!</button>
                    </div>
                </li>
            `;
            shopContainer.insertAdjacentHTML("beforeend", html);
            const item = document.querySelector(
                `.shop--button[data-id="${data.id}"]`
            );
            item.addEventListener("click", this._redeem.bind(this));
        });
    }
    _redeem(data) {
        const el = data.target.closest(".item");
        const id = el.dataset.id;
        const item = items.find((item) => item.id === parseInt(id));
        if (!item) return;
        if (this.#points >= item.points) {
            this.#points -= item.points;
            this._renderMoney();
            this._setLocalStorage();
            return;
        } else {
            alert("You don't have enough points!");
            return;
        }
    }
}

const app = new App();
