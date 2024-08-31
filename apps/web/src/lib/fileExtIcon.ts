import { BsFiletypeJpg, BsFiletypeMp3, BsFiletypePdf, BsFiletypePng, BsFiletypeWav } from "react-icons/bs";
import { GoFile } from "react-icons/go";

export const fileExtIcon = {
	pdf: BsFiletypePdf,
	png: BsFiletypePng,
	jpg: BsFiletypeJpg,
	wav: BsFiletypeWav,
	mp3: BsFiletypeMp3,
	default: GoFile,
}

export type FileExtIcon = keyof typeof fileExtIcon;