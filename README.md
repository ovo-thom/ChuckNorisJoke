# Asynchronous Javascript

## Theory

### Synchronous code execution

So far all the things we have seen were executed in the order they were written. For example:

```javascript
const name = "Jean-Didier";
console.log(name);

const max = 5;
for (let i = 0; i < max; i++) {
  console.log(i);
}
console.log("end");
```

The console should display this:

```
Jean-Didier
0
1
2
3
4
end
```

This is how most programming languages work, and it is fine BUT ...

### The problem with synchronicity

You already know that JavaScript can schedule a task in the future, for example with a DOM interaction or when you contact a Timer.

Let's try the **BAD** approach.

```javascript
const in1Second = Date.now() + 1000;
let operations = 0;

console.log("Before the delay");

// This loop is executed until we reach the in1Second timestamp
while (Date.now() < in1Second) {
  operations += 1;
}

console.log("After the delay");
console.log("We could have done " + operations + " operations in that time.");
```

Result:

```
Before the delay
After the delay
We could have done 14152747 operations in that time.
```

This is really bad because, we're essentially blocking any other task from happening during the timeframe.

Using the **RIGHT** approach :

```javascript
console.log("Before the delay");
setTimeout(() => console.log("After 1s"), 1000);
console.log("After the delay");
```

```javascript
Before the delay
After the delay
After 1s
```

We can see that `After the delay` is displayed even though it is written after the **setTimeout** function. This is an **asynchronous** operation.

We can also say that this method is **non-blocking**, since code execution can continue, even though we have stuff planned in the future.

Event listeners are another way of writing asynchronous code. The code is only executed once the event happens.

### Promises

So we already know about timeouts/intervals and event listeners. There is another type of asynchronous code we haven't seen so far, which is [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), a name that pretty much says : `It is not ready yet, but when ready I'll execute something!`

![I promise](promise.gif)

A promise is characterized by its **state**.

| State             | Description                              |
| ----------------- | ---------------------------------------- |
| Pending           | The Promise is initialized               |
| Settled           | The Promise is done (failed or succeful) |
| Success (resolve) | The promise is succesful                 |
| Failure (reject)  | The promise has failed                   |

A common use case for promise are AJAX requests. The idea is to dynamically load the content of the webpage by doing selected request on the page.

![A page full of pending promises](mybecode.png)
_This page is full of pending promises..._

### The fetch function (AJAX)

I assume this is still pretty vague, so let's try an example right away. The [fetch() function](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch), allows you to send a request to your server.

Imagine we have a text document on our server, named `document.txt`:

```javascript
const request = fetch("document.txt");
console.log("Making the request:", request); // Promise is pending

const response = request.then((response) => response.text());
console.log("Treating the response", response); // Promise is pending

response.then((text) => {
  console.log(text);
});
```

- Request creates a promise. It will be fulfilled when the server sends the document back.
- When we have the response, we call `response.text()` to say we want to interpret the response as a text. It creates a new promise
- When the text is fully loaded, we create a function to log the result into the console.

We can **chain** the promises so they appear more concise:

```javascript
fetch("document.txt")
  .then((response) => response.text())
  .then((text) => {
    const p = document.createElement("p");
    p.textContent = text;

    document.body.appendChild(p);
  });
```

We just need to add a little something so the code does not behave weirdly. What if `document.txt` does not exist ? Or has been renamed ? Or the server has been eaten ? We need to take Promise failure into account using the `catch()` method.

```javascript
fetch("document.txt")
  .then((response) => response.text())
  .then((text) => {
    const p = document.createElement("p");
    p.textContent = text;

    document.body.appendChild(text);
  })
  .catch((error) => {
    console.log("There was an error!", error);
  });
```

### Cross-server request (APIs)

Normally you would use `fetch()` to query your own server, however some websites allow us to do query on their server via an `API`.

In this case an API is simply an URL that returns special values that you can use directly in your JS code. For this example, we're going to use the [**agify** API](https://agify.io/) to predict the age of a given name.

For instance if you go to [https://api.agify.io/?name=nicolas](https://api.agify.io/?name=nicolas), you'll see a webpage returning a [JSON object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON), containing the number of person with that name, and their median age. This is super useful because we can directly use this value in our code. Here's how:

```javascript
const fetchName = (name) => fetch("https://api.agify.io/?name=" + name);

fetchName("keith")
  .then((response) => response.json())
  .then((json) => {
    console.log(json.age);
    console.log(json.count);
  })
  .catch((error) => {
    console.log("There was an error!", error);
  });
```

### Debugging requests

When making fetch request, make sure to check out the `network` panel of your browser devtools! It's going to be really useful. It is available on every major browser such as [Firefox](https://developer.mozilla.org/en-US/docs/Tools/Network_Monitor) or [Chrome/Brave](https://developers.google.com/web/tools/chrome-devtools/network)

### Ressources

- [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
- [MDN: Using fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Call stack & Event Loop slides](https://docs.google.com/presentation/d/1F5CymeDIWByzOw6qPi0ZO0AEwt0Svow_9zjZnjWkG64/edit?usp=sharing)

## Exercises

### Exercise 1

For this exercise we're going to use [VSCode's live-server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), which allows us to have a running backend in a few seconds.

Create a new directory (= folder), containing 3 files:

- index.html
- script.js
- [becode.json](becode.json)

Create a `<button>`, when clicked becode rules are loaded with a `fetch('becode.json')`, then dynamically generate a `<ul>` list containing each rule in a `<li>`.

### Exercise 2

Make a new page with a button. When the button is clicked, a fetch query is sent to the [Chuck Norris API](https://api.chucknorris.io/) to fetch a random fact. When the request is finished display the result in a new div on the page. Keep the the past requests on the page by creating a new div each time you make an API call.

#### Extra steps

- Also add a `<select>` field fetch all categories and populate the list with them. When the user selects a category, they can press the button and make a fetch request with the selected category. There should also be a "none" option.
- Store the previous results in a localStorage to keep the list when opening the page again.
- Make a empty localstorage button to remove all items.
- Using the promise syntax? Try to use `async/await` instead!
