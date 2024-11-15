export async function load({ fetch }) {
    const response = await fetch("https://interludeone.com/");
    const html = await response.text();
    return { html };
}
