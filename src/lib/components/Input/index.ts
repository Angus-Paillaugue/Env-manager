import InputComponent from './Input.svelte';
import FloatingInput from './Floating.svelte';
import TextareaInput from './Textarea.svelte';
import FileInput from './File.svelte';

const Input = InputComponent as typeof InputComponent & {
	Floating: typeof FloatingInput;
	Textarea: typeof TextareaInput;
	File: typeof FileInput;
};
Input.Floating = FloatingInput;
Input.Textarea = TextareaInput;
Input.File = FileInput;

export default Input;
