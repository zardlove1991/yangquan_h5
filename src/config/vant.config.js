import { Button, Cell, Empty, Icon, ImagePreview, Lazyload, List, NavBar, Picker, Popup, Search, Swipe, SwipeItem } from 'vant';
import 'vant/lib/index.css';
export function vant(app) {
    app.use(Button)
    .use(Search)
    .use(Icon)
    .use(List)
    .use(Swipe)
    .use(SwipeItem)
    .use(Picker)
    .use(Popup)
    .use(Cell)
    .use(List)
    .use(Empty)
    .use(NavBar)
    .use(ImagePreview)
    .use(Lazyload)
}