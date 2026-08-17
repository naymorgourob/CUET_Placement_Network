import { Provider } from '@radix-ui/react-tooltip';

export function TooltipProvider({ children }) {
  return (
    <Provider delayDuration={200} skipDelayDuration={100}>
      {children}
    </Provider>
  );
}
