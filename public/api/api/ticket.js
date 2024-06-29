export const getTicket = () => {
    return fetch("https://wd79p.com/backend/public/api/tickets").then((res) => res.json())
}