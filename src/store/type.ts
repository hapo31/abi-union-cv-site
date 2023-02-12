export type SelectorType<Store, Selected> = (store: Store) => Selected;

export type UseStoreType<
  Store,
  Selected,
  Selector extends SelectorType<Store, Selected>
> = (selector: Selector) => Selected;
