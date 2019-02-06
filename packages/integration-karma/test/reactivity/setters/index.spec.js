import { createElement } from 'test-utils';

import Parent from 'x/parent';

describe('Reactivity for setters', () => {
    it('should not alter rendering if they are not invoked', () => {
        let elm = createElement('x-test', { is: Parent });
        document.body.appendChild(elm);
        expect(elm.getRenderingCounter()).toBe(1);
        expect(elm.shadowRoot.querySelector('x-child.first').getRenderingCounter()).toBe(1);
    });

    it('should react to changes in parent by calling the setter on the child once', () => {
        let elm = createElement('x-test', { is: Parent });
        document.body.appendChild(elm);
        elm.addNewItem(4);
        return Promise.resolve().then(() => {
            expect(elm.getRenderingCounter()).toBe(1);
            expect(elm.shadowRoot.querySelector('x-child.second').getRenderingCounter()).toBe(2);
            expect(
                elm.shadowRoot.querySelector('x-child.second').shadowRoot.querySelectorAll('li')
                    .length
            ).toBe(4);
        });
    });

    it('should ignore string value passed to setters', () => {
        let elm = createElement('x-test', { is: Parent });
        document.body.appendChild(elm);
        elm.setCity('sanfrancisco');
        return Promise.resolve().then(() => {
            expect(elm.getRenderingCounter()).toBe(2);
            expect(elm.shadowRoot.querySelector('x-child.third').getRenderingCounter()).toBe(2);
        });
    });
});
