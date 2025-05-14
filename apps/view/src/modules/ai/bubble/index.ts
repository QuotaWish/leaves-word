import FloatingBall from './index.vue'

export class FloatingBubbleState {
  pos: {
    layout: 'left' | 'right',
    x: number
    y: number
  } = {
      x: 0,
      y: 0,
      layout: 'right',
    };

  init: boolean = false;
}

export const floatingBubbleState = useLocalStorage("leaf-ai-bubble", new FloatingBubbleState())

export default FloatingBall
