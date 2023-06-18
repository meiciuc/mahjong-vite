class HtmlService {
    get ui(): HTMLDivElement {
        let ui: HTMLDivElement | null = document.body.querySelector('#ui');
        if (!ui) {
            ui = document.createElement('div') as HTMLDivElement;
            ui.style.position = 'absolute';
            ui.style.top = '0px';
            ui.style.left = '0px';
            ui.id = 'ui';
            document.body.appendChild(ui);
        }
        return ui;
    }
}
export const htmlService = new HtmlService();