import InputComponent from './Input.svelte';
import FloatingInput from './Floating.svelte';
import TextareaInput from './Textarea.svelte';
import FileInput from './File.svelte';
import TOTPInput from './TOTP.svelte';

const Input = InputComponent as typeof InputComponent & {
	Floating: typeof FloatingInput;
	Textarea: typeof TextareaInput;
	File: typeof FileInput;
	TOTP: typeof TOTPInput;
};
Input.Floating = FloatingInput;
Input.Textarea = TextareaInput;
Input.File = FileInput;
Input.TOTP = TOTPInput;

export default Input;
