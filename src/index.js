class Pixys {
    constructor(src, options = {}) {
        const defaultOptions = {
            headers: {},
            crossOrigin: 'anonymous'
        };
        this.options = Object.assign({}, defaultOptions, options);

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.loaded = false;

        const setImage = (img) => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.context.drawImage(img, 0, 0);
            this.loaded = true;
        }

        if (typeof src === 'string') {
            const img = new Image();
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    img.src = URL.createObjectURL(xhr.response);
                    img.crossOrigin = this.options.crossOrigin;
                    img.onload = () => {
                        setImage(img);
                    }
                }
            };

            xhr.open('GET', src);
            xhr.responseType = 'blob';
            for (let key of Object.keys(this.options.headers)) {
                xhr.setRequestHeader(key, this.options.headers[key])
            }
            xhr.send(null);
        } else if (src instanceof HTMLElement && src.tagName.toLocaleLowerCase() === 'img') {
            setImage(src);
        }

        if (this.options.parent instanceof HTMLElement) {
            this.options.parent.appendChild(this.canvas);
        } else if (typeof this.options.parent === 'string') {
            document.getElementById(this.options.parent).appendChild(this.canvas);
        }
    }

    getValue(x, y) {
        const pixel = this.context.getImageData(x, y, 1, 1);
        return pixel.data;
    }

    setValue(x, y, value = {}) {
        console.log(this);
        let pixel = this.context.getImageData(x, y, 1, 1);
        if (value.hasOwnProperty('r')) pixel.data[0] = value.r;
        if (value.hasOwnProperty('g')) pixel.data[1] = value.g;
        if (value.hasOwnProperty('b')) pixel.data[2] = value.b;
        if (value.hasOwnProperty('a')) pixel.data[3] = value.a;
        this.context.putImageData(pixel, x, y);
    }

    setPicker(cb) {
        const pick = (event) => {
            const x = event.layerX;
            const y = event.layerY;
            const value = this.getValue(x, y)

            cb(x, y, value);
        }
        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            pick(event);
        });
        this.canvas.addEventListener('click', pick);
    }
}