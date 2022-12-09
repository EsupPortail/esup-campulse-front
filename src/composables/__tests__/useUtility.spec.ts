import {describe, expect, it} from 'vitest'
import useUtility from '@/composables/useUtility'


describe('useUtility', () => {
    describe('formatDate', () => {
        it('should return formatted date', () => {
            const {formatDate} = useUtility()
            expect(formatDate('2022-10-27 13:45:35.000000 +00:00')).toEqual('27/10/2022')
        })
        it('should not return a date with an error', () => {
            const {formatDate} = useUtility()
            expect(formatDate('2022-10-27 13:45:35.000000 +00:00')).not.toEqual('28/10/2022')
        })
        it('should return nothing if no date in arg', () => {
            const {formatDate} = useUtility()
            expect(formatDate('')).toBeUndefined()
        })
    })
})
