import React, { useEffect } from 'react';
import {
  Control,
  FieldValues,
  useController,
  UseFormSetValue,
} from 'react-hook-form';

interface FieldDecoratorProps {
  label: string;
  name: string;
  children: React.ReactElement;
  control: Control<FieldValues>;
  visible?: boolean;
  setNullCondition?: boolean;
  setValue: UseFormSetValue<FieldValues>;
  transformIn?: (value: any) => any;
  transformOut?: (value: any) => any;
  className?: string;
  hiddenWhenInvisible?: boolean;
}

export default function FieldDecorator({
  label,
  name,
  children,
  control,
  visible = true,
  setNullCondition = true,
  hiddenWhenInvisible = false,
  setValue,
  transformIn,
  transformOut,
  className,
}: FieldDecoratorProps) {
  useEffect(() => {
    if (!visible && setNullCondition) {
      setValue(name, null);
    }
  }, [visible, setNullCondition, name, setValue]);

  const {
    field: { onChange, onBlur, value, ref },
    formState: { errors },
  } = useController({
    name,
    control,
  });

  const onChangeHandler = (changedValue: any) => {
    const transformedValue = transformOut
      ? transformOut(changedValue)
      : changedValue;
    onChange(transformedValue ?? null);
  };
  return visible ? (
    <div className={`flex flex-col ${className}`}>
      {/* label */}
      <div className="h-[23px]">{label}</div>
      {/* children */}
      <div className="h-[32px]">
        {React.cloneElement(children, {
          onChange: onChangeHandler,
          onBlur,
          value: transformIn ? transformIn(value) : value,
          ref,
        })}
      </div>
      {/* err */}
      <div className="h-[24px] flex items-center text-red-500">
        {errors[name] && errors[name].message}
      </div>
    </div>
  ) : (
    <div className={hiddenWhenInvisible ? 'hidden' : ''} />
  );
}
