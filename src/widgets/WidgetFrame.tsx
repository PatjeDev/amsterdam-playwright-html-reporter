import { useState, type ReactNode } from 'react'

import {
    Button,
    Field,
    Heading,
    IconButton,
    Label,
    ModalDialog,
    Row,
    Select,
    Switch,
} from '@amsterdam/design-system-react'
import {
    CogwheelIcon,
    EllipsisIcon,
} from '@amsterdam/design-system-react-icons'
import { clsx } from '@web/uiUtils'

import { useTranslation, type TranslationKey } from '../i18n'
import {
    widgetWidthLabelKeys,
    widgetWidthOptions,
    type WidgetWidth,
} from './widgetLayout'

type WidgetFrameProps = {
    id: string
    titleKey: TranslationKey
    width: WidgetWidth
    isDragging: boolean
    isDropTarget: boolean
    onWidthChange: (width: WidgetWidth) => void
    onDragStartWidget: (id: string) => void
    onDragEndWidget: () => void
    onDragOverWidget: (id: string) => void
    onDropWidget: (id: string) => void
    onVisibilityChange: (visible: boolean) => void
    children: ReactNode
}

export function WidgetFrame({
    id,
    titleKey,
    width,
    isDragging,
    isDropTarget,
    onWidthChange,
    onDragStartWidget,
    onDragEndWidget,
    onDragOverWidget,
    onDropWidget,
    onVisibilityChange,
    children,
}: WidgetFrameProps) {
    const { t } = useTranslation()
    const [settingsOpen, setSettingsOpen] = useState(false)

    return (
        <div
            className={clsx(
                'widget-frame',
                isDragging && 'widget-frame--dragging',
                isDropTarget && 'widget-frame--drop-target',
            )}
            onDragOver={(event) => {
                event.preventDefault()
                onDragOverWidget(id)
            }}
            onDrop={(event) => {
                event.preventDefault()
                onDropWidget(id)
            }}
        >
            <div className="widget-frame__toolbar">
                <IconButton
                    type="button"
                    svg={EllipsisIcon}
                    size="heading-5"
                    label={t('widget.drag.label')}
                    className="widget-frame__handle"
                    draggable
                    onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = 'move'
                        event.dataTransfer.setData('text/plain', id)
                        onDragStartWidget(id)
                    }}
                    onDragEnd={onDragEndWidget}
                />

                <IconButton
                    type="button"
                    svg={CogwheelIcon}
                    size="heading-5"
                    label={t('widget.settings.open')}
                    onClick={() => setSettingsOpen(true)}
                />
            </div>

            {children}

            <ModalDialog
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            >
                <ModalDialog.Header>
                    <Heading level={2} size="level-4">
                        {t('widget.settings.titleFor', { name: t(titleKey) })}
                    </Heading>
                </ModalDialog.Header>

                <ModalDialog.Body>
                    <Field>
                        <Label htmlFor={`${id}-width`}>
                            {t('widget.settings.width')}
                        </Label>

                        <Select
                            id={`${id}-width`}
                            value={width}
                            onChange={(event) =>
                                onWidthChange(
                                    event.target.value as WidgetWidth,
                                )
                            }
                        >
                            {widgetWidthOptions.map((option) => (
                                <Select.Option key={option} value={option}>
                                    {t(widgetWidthLabelKeys[option])}
                                </Select.Option>
                            ))}
                        </Select>
                    </Field>

                    <Field>
                        <Row alignVertical="center" gap="small">
                            <Switch
                                id={`${id}-visible`}
                                checked
                                onChange={(event) =>
                                    onVisibilityChange(event.target.checked)
                                }
                            />
                            <Label htmlFor={`${id}-visible`}>
                                {t('widget.settings.visible')}
                            </Label>
                        </Row>
                    </Field>
                </ModalDialog.Body>

                <ModalDialog.Footer>
                    <Button
                        variant="primary"
                        onClick={() => setSettingsOpen(false)}
                    >
                        {t('widget.settings.close')}
                    </Button>
                </ModalDialog.Footer>
            </ModalDialog>
        </div>
    )
}
