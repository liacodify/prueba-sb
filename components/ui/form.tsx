import * as React from "react";
import {
	Controller,
	FormProvider,
	useFormContext,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const Form = FormProvider;

const FormFieldContext = React.createContext<{ name: string }>({ name: "" });

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const context = useFormContext();
	return { ...fieldContext, ...context };
};

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
	({ className, ...props }, ref) => {
		const { name } = useFormField();
		return (
			<div
				ref={ref}
				className={cn("space-y-2", className)}
				data-field-name={name}
				{...props}
			/>
		);
	},
);
FormItem.displayName = "FormItem";

interface FormLabelProps extends React.HTMLAttributes<HTMLLabelElement> {}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
	({ className, ...props }, ref) => {
		return <Label ref={ref} className={cn(className)} {...props} />;
	},
);
FormLabel.displayName = "FormLabel";

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
	({ ...props }, ref) => {
		return <div ref={ref} {...props} />;
	},
);
FormControl.displayName = "FormControl";

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
	({ className, ...props }, ref) => {
		const { name, formState } = useFormField();
		const error = formState.errors[name];

		if (!error) return null;

		return (
			<p
				ref={ref}
				className={cn("text-sm font-medium text-red-500", className)}
				{...props}
			>
				{(error.message as string) || "Error"}
			</p>
		);
	},
);
FormMessage.displayName = "FormMessage";

export {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
};

interface FormDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<
	HTMLParagraphElement,
	FormDescriptionProps
>(({ className, ...props }, ref) => {
	return (
		<p
			ref={ref}
			className={cn("text-sm text-slate-500", className)}
			{...props}
		/>
	);
});
FormDescription.displayName = "FormDescription";

interface FormFieldProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: any;
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	render: (props: { field: any; fieldState: any }) => React.ReactElement;
}

const FormField = ({ name, control, render }: FormFieldProps) => {
	return (
		<FormFieldContext.Provider value={{ name }}>
			<Controller
				name={name}
				control={control}
				render={({ field, fieldState }) => render({ field, fieldState })}
			/>
		</FormFieldContext.Provider>
	);
};
