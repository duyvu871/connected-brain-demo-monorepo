const base = "https://translate.googleapis.com/translate_a/single";

export default {
    fetch: ({ key, from, to, text }: {
        key?: string, from: string, to: string, text: string
    }) => [
        `${base}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(text)}`,
    ],
    parse: (res: Response) =>
        res.json().then((body) => {
            body = body && body[0] && body[0][0] && body[0].map((s: any) => s[0]).join("");
            if (!body) throw new Error("Translation not found");
            return body;
        }),
};