export const StatusColors = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'] as const;

export type StatusColor = (typeof StatusColors)[number];

export function isStatusColor(color: string): color is StatusColor {
  return StatusColors.some(it => it === color);
}
