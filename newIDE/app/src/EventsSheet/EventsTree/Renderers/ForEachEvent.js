// @flow
import * as React from 'react';
import InstructionsList from '../InstructionsList.js';
import classNames from 'classnames';
import {
  largeSelectedArea,
  largeSelectableArea,
  selectableArea,
  executableEventContainer,
  disabledText,
} from '../ClassNames';
import InlinePopover from '../../InlinePopover';
import ObjectField from '../../ParameterFields/ObjectField';
import { type EventRendererProps } from './EventRenderer';
import ConditionsActionsColumns from '../ConditionsActionsColumns';
const gd = global.gd;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  instructionsContainer: {
    display: 'flex',
  },
  actionsList: {
    flex: 1,
  },
};

export default class ForEachEvent extends React.Component<
  EventRendererProps,
  *
> {
  state = {
    editing: false,
    anchorEl: null,
  };

  edit = (domEvent: any) => {
    // We should not need to stop the event propagation, but
    // if we don't do this, the InlinePopover's clickaway listener
    // is immediately picking up the event and closing.
    // Caveat: we can open multiple InlinePopover.
    // Search the rest of the codebase for onlinepopover-event-hack
    domEvent.preventDefault();
    domEvent.stopPropagation();

    this.setState({
      editing: true,
      anchorEl: domEvent.currentTarget,
    });
  };

  endEditing = () => {
    this.setState({
      editing: false,
      anchorEl: null,
    });
  };

  render() {
    var forEachEvent = gd.asForEachEvent(this.props.event);

    const objectName = forEachEvent.getObjectToPick();
    return (
      <div
        style={styles.container}
        className={classNames({
          [largeSelectableArea]: true,
          [largeSelectedArea]: this.props.selected,
          [executableEventContainer]: true,
        })}
      >
        <div>
          <span
            className={classNames({
              [selectableArea]: true,
              [disabledText]: this.props.disabled,
            })}
            onClick={this.edit}
          >
            {objectName ? (
              `Repeat for each ${objectName} object:`
            ) : (
              <i>
                Click to choose for which objects this event will be repeated
              </i>
            )}
          </span>
        </div>
        <ConditionsActionsColumns
          leftIndentWidth={this.props.leftIndentWidth}
          windowWidth={this.props.windowWidth}
          renderConditionsList={({ style, className }) => (
            <InstructionsList
              instrsList={forEachEvent.getConditions()}
              style={style}
              className={className}
              selection={this.props.selection}
              areConditions
              onAddNewInstruction={this.props.onAddNewInstruction}
              onPasteInstructions={this.props.onPasteInstructions}
              onMoveToInstruction={this.props.onMoveToInstruction}
              onMoveToInstructionsList={this.props.onMoveToInstructionsList}
              onInstructionClick={this.props.onInstructionClick}
              onInstructionDoubleClick={this.props.onInstructionDoubleClick}
              onInstructionContextMenu={this.props.onInstructionContextMenu}
              onInstructionsListContextMenu={
                this.props.onInstructionsListContextMenu
              }
              onParameterClick={this.props.onParameterClick}
              disabled={this.props.disabled}
              renderObjectThumbnail={this.props.renderObjectThumbnail}
              screenType={this.props.screenType}
              windowWidth={this.props.windowWidth}
            />
          )}
          renderActionsList={({ className }) => (
            <InstructionsList
              instrsList={forEachEvent.getActions()}
              style={
                {
                  ...styles.actionsList,
                } /* TODO: Use a new object to force update - somehow updates are not always propagated otherwise */
              }
              className={className}
              selection={this.props.selection}
              areConditions={false}
              onAddNewInstruction={this.props.onAddNewInstruction}
              onPasteInstructions={this.props.onPasteInstructions}
              onMoveToInstruction={this.props.onMoveToInstruction}
              onMoveToInstructionsList={this.props.onMoveToInstructionsList}
              onInstructionClick={this.props.onInstructionClick}
              onInstructionDoubleClick={this.props.onInstructionDoubleClick}
              onInstructionContextMenu={this.props.onInstructionContextMenu}
              onInstructionsListContextMenu={
                this.props.onInstructionsListContextMenu
              }
              onParameterClick={this.props.onParameterClick}
              disabled={this.props.disabled}
              renderObjectThumbnail={this.props.renderObjectThumbnail}
              screenType={this.props.screenType}
              windowWidth={this.props.windowWidth}
            />
          )}
        />
        <InlinePopover
          open={this.state.editing}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.endEditing}
        >
          <ObjectField
            project={this.props.project}
            scope={this.props.scope}
            globalObjectsContainer={this.props.globalObjectsContainer}
            objectsContainer={this.props.objectsContainer}
            value={objectName}
            onChange={text => {
              forEachEvent.setObjectToPick(text);
              this.props.onUpdate();
            }}
            isInline
          />
        </InlinePopover>
      </div>
    );
  }
}
