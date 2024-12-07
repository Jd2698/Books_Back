import { NotFoundException } from '@nestjs/common'
import { unlink, writeFile } from 'fs/promises'
import { resolve } from 'path'

export const saveImage = async (
	file: Express.Multer.File,
	pathToSave: string[]
): Promise<{ imagePath: string; filename: string }> => {
	const timestamp = new Date().toISOString().replace(/[-T:.]/g, '')
	const extension = file.mimetype.split('/')[1]
	const filename = `${timestamp}.${extension}`
	const imagePath = `${
		pathToSave[pathToSave.length - 1]
	}/${timestamp}.${extension}`

	const uploadPath = resolve(...pathToSave, filename)
	await writeFile(uploadPath, file.buffer).catch(() => {
		throw new Error('Error saving the file')
	})

	file.filename = filename
	return {
		filename,
		imagePath
	}
}

export const deleteImage = async (imagePath: string): Promise<void> => {
	const filePath = `images/${imagePath}`

	await unlink(filePath).catch(() => {
		throw new Error('Image to delete not found')
	})
}
