import {
  useCallback,
  useEffect,
  useState,
  Children,
  isValidElement,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type PropsWithChildren,
} from "react";

import {
  useCombobox,
  type UseComboboxGetInputPropsReturnValue,
  type UseComboboxProps,
} from "downshift";

import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";

import { createContext, useContext } from "react";
import type { UseComboboxReturnValue } from "downshift";

import { CircleIcon } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export type ComboboxItemBase = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type ComboboxContextValue = Partial<
  Pick<
    UseComboboxReturnValue<ComboboxItemBase>,
    | "getInputProps"
    | "getItemProps"
    | "getMenuProps"
    | "highlightedIndex"
    | "inputValue"
    | "isOpen"
    | "selectedItem"
    | "selectItem"
    | "setInputValue"
  > & {
    filteredItems: ComboboxItemBase[];
    items: ComboboxItemBase[];
    onItemsChange: (items: ComboboxItemBase[]) => void;
    onValueChange: (value: string | null) => void;
    openedOnce: boolean;
  }
>;

export const ComboboxContext = createContext<ComboboxContextValue>({});

export const useComboboxContext = () => useContext(ComboboxContext);

const { stateChangeTypes } = useCombobox;

const defaultFilter = (inputValue: string, items: ComboboxItemBase[]) =>
  items.filter(
    (item) =>
      !inputValue ||
      item.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.value.toLowerCase().includes(inputValue.toLowerCase())
  );

export type ComboboxProps = PropsWithChildren<{
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  filterItems?: (
    inputValue: string,
    items: ComboboxItemBase[]
  ) => ComboboxItemBase[];
}>;

export const ControlledCombobox = ({
  value,
  onValueChange,
  filterItems = defaultFilter,
  children,
}: ComboboxProps) => {
  const [items, setItems] = useState<ComboboxItemBase[]>([]),
    [filteredItems, setFilteredItems] = useState<ComboboxItemBase[]>(items);
  const [openedOnce, setOpenedOnce] = useState(false);

  const stateReducer = useCallback<
    NonNullable<UseComboboxProps<ComboboxItemBase>["stateReducer"]>
  >(
    (prev, { type, changes }) => {
      switch (type) {
        case stateChangeTypes.InputChange: {
          const filteredEnabledItems = filterItems(
            changes.inputValue || prev.inputValue,
            items
          ).filter(({ disabled }) => !disabled);

          const highlightedIndex =
            typeof changes.highlightedIndex === "number"
              ? changes.highlightedIndex
              : prev.highlightedIndex;

          return {
            ...changes,
            highlightedIndex:
              changes.inputValue &&
              filteredEnabledItems.length > 0 &&
              highlightedIndex < 0
                ? 0
                : changes.highlightedIndex,
          };
        }

        case stateChangeTypes.InputBlur:
        case stateChangeTypes.InputClick:
        case stateChangeTypes.InputKeyDownEnter:
        case stateChangeTypes.InputKeyDownEscape: {
          // Allow custom input if no item is selected
          if (!prev.selectedItem) {
            return {
              ...changes,
              inputValue: changes.inputValue || prev.inputValue,
            };
          }

          if (changes.isOpen || !prev.isOpen)
            return {
              ...changes,
              inputValue: prev.selectedItem?.label || prev.inputValue,
              selectedItem: prev.selectedItem,
            };

          const inputValue =
            changes.selectedItem?.label || prev.selectedItem?.label || "";
          return { ...changes, inputValue };
        }

        default:
          return changes;
      }
    },
    [filterItems, items]
  );

  const {
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    inputValue,
    isOpen,
    selectedItem,
    selectItem,
    setInputValue,
  } = useCombobox({
    items: filteredItems,
    itemToString: (item) => (item ? item.label : ""),
    isItemDisabled: (item) => item.disabled ?? false,

    selectedItem:
      typeof value !== "undefined"
        ? items.find((item) => item.value === value) || null
        : undefined,
    onSelectedItemChange: ({ selectedItem }) =>
      onValueChange?.(selectedItem?.value || null),

    stateReducer,
  });

  useEffect(() => {
    if (isOpen && !openedOnce) setOpenedOnce(isOpen);
  }, [isOpen, openedOnce]);

  useEffect(() => {
    setFilteredItems(filterItems(inputValue || "", items));
  }, [filterItems, inputValue, items]);

  return (
    <ComboboxContext.Provider
      value={{
        filteredItems,
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        items,
        onItemsChange: setItems,
        onValueChange,
        openedOnce,
        selectedItem,
        selectItem,
        setInputValue,
      }}
    >
      <Popover open={isOpen}>{children}</Popover>
    </ComboboxContext.Provider>
  );
};

export type ComboboxContentProps = ComponentPropsWithoutRef<
  typeof PopoverContent
>;

export const ComboboxContent = ({
  onOpenAutoFocus,
  children,
  ...props
}: ComboboxContentProps) => {
  const { getMenuProps, isOpen, openedOnce, onItemsChange } =
    useComboboxContext();

  const childItems = useMemo(
    () =>
      Children.toArray(children).filter(
        (child): child is ReactElement<ComboboxItemProps> =>
          isValidElement(child) && child.type === ComboboxItem
      ),
    [children]
  );

  useEffect(() => {
    onItemsChange?.(
      childItems.map((child) => ({
        disabled: child.props.disabled,
        label: child.props.label,
        value: child.props.value,
      }))
    );
  }, [childItems, onItemsChange]);

  return (
    <PopoverContent
      {...props}
      forceMount
      asChild
      onOpenAutoFocus={(e) => {
        e.preventDefault();
        onOpenAutoFocus?.(e);
      }}
      className={cn(
        "w-[--radix-popper-anchor-width] p-0 [[data-radix-popper-content-wrapper]:has(&)]:h-0",
        !isOpen && "pointer-events-none",
        !openedOnce && "hidden"
      )}
      {...getMenuProps?.({}, { suppressRefError: true })}
    >
      <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-80 [&>[data-radix-scroll-area-viewport]]:p-1">
        {children}
      </ScrollArea>
    </PopoverContent>
  );
};

export type ComboboxItemProps = ComboboxItemBase &
  ComponentPropsWithoutRef<"li">;

export const ComboboxItem = ({
  label,
  value,
  disabled,
  className,
  children,
  ...props
}: ComboboxItemProps) => {
  const { filteredItems, getItemProps, selectedItem } = useComboboxContext();

  const isSelected = selectedItem?.value === value;
  const item = useMemo(
    () => ({ disabled, label, value }),
    [disabled, label, value]
  );
  const index = (filteredItems || []).findIndex(
    (item) => item.value.toLowerCase() === value.toLowerCase()
  );
  if (index < 0) return null;

  return (
    <li
      {...props}
      data-index={index}
      className={cn(
        `relative flex cursor-default select-none flex-col rounded-sm px-3 py-1.5 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-selected:bg-accent aria-selected:text-accent-foreground`,
        !children && "ps-8",
        className
      )}
      {...getItemProps?.({ item, index })}
    >
      {children || (
        <>
          <span className="text-sm text-foreground">{label}</span>
          {isSelected && (
            <span className="absolute start-3 top-0 flex h-full items-center justify-center">
              <CircleIcon className="size-2 fill-current" />
            </span>
          )}
        </>
      )}
    </li>
  );
};

export type ComboboxInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  keyof UseComboboxGetInputPropsReturnValue
> & {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ComboboxInput = ({
  value,
  onChange,
  ...props
}: ComboboxInputProps) => {
  const { getInputProps, selectedItem } = useComboboxContext();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      getInputProps?.().onChange?.(e);
    },
    [onChange, getInputProps]
  );

  return (
    <div className="relative w-full" data-combobox-input-wrapper="">
      <PopoverAnchor asChild>
        <Input
          {...props}
          {...getInputProps?.()}
          value={value ?? getInputProps?.().value}
          onChange={handleChange}
        />
      </PopoverAnchor>
      <div className="pointer-events-none absolute inset-y-0 end-3 grid h-full place-items-center">
        <ChevronDownIcon className="size-4 opacity-50" />
      </div>
    </div>
  );
};

export const ComboboxEmpty = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  const { filteredItems } = useComboboxContext();
  if (filteredItems && filteredItems.length > 0) return null;

  return (
    <div
      {...props}
      className={cn("p-4 text-center text-sm text-muted-foreground", className)}
    >
      {children || "No items found"}
    </div>
  );
};
