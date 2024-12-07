import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { BadRequestException } from '@nestjs/common'

export const FileInterceptorDecorator = () => {
	return applyDecorators(
		UseInterceptors(
			FileInterceptor('file', {
				fileFilter: (req, file, cb) => {
					if (!file.originalname.match(/\.+(jpg|jpeg|png)$/i)) {
						return cb(new BadRequestException('Image is not valid'), false)
					}
					return cb(null, true)
				}
			})
		)
	)
}
