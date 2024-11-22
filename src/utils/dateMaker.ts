export function dateMaker() {
    const date = new Date();

    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDay().toString();
    const hour = date.getHours().toString();
    const min = date.getMinutes().toString();

    return year+month+day+hour+min;

}