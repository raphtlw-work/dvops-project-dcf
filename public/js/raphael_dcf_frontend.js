const MAIN_VIEW = "home"

window.onload = () => {
  showView(MAIN_VIEW)
}

let viewStack = [MAIN_VIEW]

function pushView(name) {
  viewStack.push(name)

  const viewName = viewStack.pop()

  showView(viewName)
}

function popView() {
  const viewName = viewStack.pop()

  showView(viewName)
}

function showView(viewName) {
  document.querySelectorAll("main").forEach((el) => el.classList.add("hidden"))
  document.getElementById(`view-${viewName}`).classList.remove("hidden")

  if (viewName !== MAIN_VIEW) {
    document
      .querySelector("#back-navigation .back-btn")
      .classList.remove("hidden")
  } else {
    viewStack = [MAIN_VIEW]
    document.querySelector("#back-navigation .back-btn").classList.add("hidden")
  }
}
