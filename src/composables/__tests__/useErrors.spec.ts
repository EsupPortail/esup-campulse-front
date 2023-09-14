import {describe, expect, it} from 'vitest'
import useErrors from '@/composables/useErrors'
import i18n from '@/plugins/i18n'

describe('useErrors', () => {
    const {catchHTTPError} = useErrors()

    describe('catchHTTPError', () => {
        describe('if the error code is 400', () => {
            it('should return the corresponding notification according to HTTP error code', () => {
                expect(catchHTTPError(400)).toEqual(i18n.global.t('notifications.negative.error-400'))
            })
        })
        describe('if the error code is 401', () => {
            it('should return the corresponding notification according to HTTP error code', () => {
                expect(catchHTTPError(401)).toEqual(i18n.global.t('notifications.negative.error-401'))
            })
        })
        describe('if the error code is 403', () => {
            it('should return the corresponding notification according to HTTP error code', () => {
                expect(catchHTTPError(403)).toEqual(i18n.global.t('notifications.negative.error-403'))
            })
        })
        describe('if the error code is 404', () => {
            it('should return the corresponding notification according to HTTP error code', () => {
                expect(catchHTTPError(404)).toEqual(i18n.global.t('notifications.negative.error-404'))
            })
        })
        describe('if the error code is 405', () => {
            it('should return the corresponding notification according to HTTP error code', () => {
                expect(catchHTTPError(405)).toEqual(i18n.global.t('notifications.negative.error-405'))
            })
        })
        describe('if the error code is 413', () => {
            it('should return the corresponding notification according to HTTP error code', () => {
                expect(catchHTTPError(413)).toEqual(i18n.global.t('notifications.negative.error-413'))
            })
        })
        describe('if the error code is 415', () => {
            it('should return the corresponding notification according to HTTP error code', () => {
                expect(catchHTTPError(415)).toEqual(i18n.global.t('notifications.negative.error-415'))
            })
        })
        describe('if the error is 5XX', () => {
            it('should return the corresponding notification according to HTTP error code', () => {
                expect(catchHTTPError(502)).toEqual(i18n.global.t('notifications.negative.error-500'))
            })
        })
    })
})
